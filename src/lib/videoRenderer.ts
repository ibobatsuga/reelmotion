import { AutoContentMode } from '../data/mockData';

export interface GeneratedScene {
  headline: string;
  narration: string;
  visualPrompt: string;
  statNumber?: string;
  statLabel?: string;
  accentColor?: string;
}

export interface GeneratedPlan {
  title: string;
  summary: string;
  caption: string;
  hashtags: string[];
  scenes: GeneratedScene[];
}

function splitNarrationIntoChunks(text: string, maxLen = 175): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > maxLen && current) {
      chunks.push(current.trim());
      current = w;
    } else {
      current = (current + ' ' + w).trim();
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

async function fetchSceneAudioBuffer(
  ctx: AudioContext,
  narration: string,
  lang: 'id' | 'en'
): Promise<AudioBuffer | null> {
  try {
    const chunks = splitNarrationIntoChunks(narration, 170);
    const buffers: AudioBuffer[] = [];

    for (const chunk of chunks) {
      const res = await fetch(
        `/api/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(chunk)}`
      );
      if (!res.ok) continue;
      const arr = await res.arrayBuffer();
      if (arr.byteLength < 100) continue;
      const decoded = await ctx.decodeAudioData(arr.slice(0));
      buffers.push(decoded);
    }

    if (buffers.length === 0) return null;
    if (buffers.length === 1) return buffers[0];

    const totalLength = buffers.reduce((acc, b) => acc + b.length, 0);
    const merged = ctx.createBuffer(
      1,
      totalLength,
      buffers[0].sampleRate
    );
    const outData = merged.getChannelData(0);
    let offset = 0;
    for (const b of buffers) {
      outData.set(b.getChannelData(0), offset);
      offset += b.length;
    }
    return merged;
  } catch {
    return null;
  }
}

async function loadSceneImage(
  prompt: string,
  width: number,
  height: number,
  seed: number
): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => resolve(null), 9000);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    const cleanPrompt = encodeURIComponent(
      `${prompt}, masterpiece, high resolution, rich colors, no text`
    );
    img.src = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function renderProductionVideo(options: {
  plan: GeneratedPlan;
  mode: AutoContentMode;
  format: '9:16' | '16:9';
  style: string;
  lang: 'id' | 'en';
  onProgress: (pct: number, stageText: string) => void;
}): Promise<{ videoUrl: string; durationSec: number }> {
  const { plan, mode, format, lang, onProgress } = options;
  const isVertical = format === '9:16';
  const W = isVertical ? 720 : 1280;
  const H = isVertical ? 1280 : 720;

  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtx();
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
  const dest = audioCtx.createMediaStreamDestination();

  // Ambient soft background pad so the video always has a rich audio track
  const padGain = audioCtx.createGain();
  padGain.gain.value = 0.015;
  padGain.connect(dest);
  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 110;
  osc1.connect(padGain);
  osc1.start();

  // Step 1: Preload Audio & Visuals for each scene in parallel
  onProgress(
    28,
    lang === 'en'
      ? 'Recording narrator voice & preparing scene visuals...'
      : 'Merekam suara narator & menyiapkan gambar tiap adegan...'
  );

  const preparedScenes = await Promise.all(
    plan.scenes.map(async (scene, idx) => {
      const [audioBuffer, image] = await Promise.all([
        fetchSceneAudioBuffer(audioCtx, scene.narration, lang),
        mode === 'video' || mode === 'clipper'
          ? loadSceneImage(scene.visualPrompt || scene.headline, W, H, 1000 + idx * 37)
          : Promise.resolve(null),
      ]);
      const durationMs = audioBuffer
        ? Math.max(3600, Math.round(audioBuffer.duration * 1000) + 450)
        : Math.max(4000, scene.narration.split(/\s+/).length * 320);

      return {
        scene,
        audioBuffer,
        image,
        durationMs,
        index: idx,
      };
    })
  );

  onProgress(
    55,
    lang === 'en'
      ? 'Matching word-by-word subtitles & assembling video...'
      : 'Menyelaraskan teks per kata & menyatukan video...'
  );

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const canvasStream = canvas.captureStream(30);
  const combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  const selectedMime =
    mimeTypes.find((m) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m)) ||
    '';

  const recorder = new MediaRecorder(
    combinedStream,
    selectedMime ? { mimeType: selectedMime, videoBitsPerSecond: 3_500_000 } : undefined
  );

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const stopPromise = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: selectedMime || 'video/webm' }));
    };
  });

  recorder.start(200);

  const palettes = [
    ['#1B2149', '#4D5BAF', '#FFA143'],
    ['#152836', '#11C6C2', '#FFD12E'],
    ['#2A1B3D', '#717CBF', '#FFA143'],
    ['#1A2639', '#4D5BAF', '#11C6C2'],
  ];

  // Render each scene in real time with synced narration audio
  for (let i = 0; i < preparedScenes.length; i++) {
    const item = preparedScenes[i];
    const pct = 58 + Math.round(((i + 1) / preparedScenes.length) * 38);
    onProgress(
      pct,
      lang === 'en'
        ? `Rendering scene ${i + 1} of ${preparedScenes.length}...`
        : `Menyatukan adegan ${i + 1} dari ${preparedScenes.length}...`
    );

    if (item.audioBuffer) {
      const source = audioCtx.createBufferSource();
      source.buffer = item.audioBuffer;
      source.connect(dest);
      source.start();
    }

    const words = item.scene.narration.trim().split(/\s+/).filter(Boolean);
    const startMs = performance.now();
    const pal = palettes[i % palettes.length];

    await new Promise<void>((resolve) => {
      const drawFrame = () => {
        const elapsed = performance.now() - startMs;
        const t = Math.min(1, elapsed / item.durationMs);

        // 1. Background (AI Image with Ken Burns Zoom/Pan OR Sovereign Motion Canvas)
        ctx.save();
        if (item.image) {
          const scale = 1.03 + t * 0.11;
          const sw = W * scale;
          const sh = H * scale;
          const dx = (W - sw) * (i % 2 === 0 ? t : 1 - t);
          const dy = (H - sh) * 0.5;
          ctx.drawImage(item.image, dx, dy, sw, sh);

          const grad = ctx.createLinearGradient(0, 0, 0, H);
          grad.addColorStop(0, 'rgba(13, 16, 33, 0.45)');
          grad.addColorStop(0.5, 'rgba(13, 16, 33, 0.25)');
          grad.addColorStop(1, 'rgba(13, 16, 33, 0.90)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);
        } else {
          const grad = ctx.createLinearGradient(0, 0, W, H);
          grad.addColorStop(0, pal[0]);
          grad.addColorStop(1, '#0F1224');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);

          // Animated glowing orb & Sovereign geometric grid
          const orbX = W * (0.3 + 0.4 * Math.sin(t * Math.PI));
          const orbY = H * 0.36;
          const rad = ctx.createRadialGradient(orbX, orbY, 10, orbX, orbY, W * 0.55);
          rad.addColorStop(0, pal[1] + '66');
          rad.addColorStop(1, 'transparent');
          ctx.fillStyle = rad;
          ctx.fillRect(0, 0, W, H);
        }
        ctx.restore();

        // 2. Top Sovereign Pill Badge & Scene Counter
        const padX = isVertical ? 44 : 80;
        const topY = isVertical ? 68 : 48;
        ctx.save();
        drawRoundedRect(ctx, padX, topY, 210, 42, 21);
        ctx.fillStyle = 'rgba(77, 91, 175, 0.85)';
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 17px "Mona Sans", system-ui, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          `ADEGAN ${i + 1} / ${preparedScenes.length}`,
          padX + 22,
          topY + 21
        );
        ctx.restore();

        // 3. Motion / Audiobook Central Card or Headline
        if (mode === 'motion' || mode === 'audiobook' || !item.image) {
          ctx.save();
          const cardW = W - padX * 2;
          const cardH = isVertical ? 360 : 250;
          const cardY = isVertical ? H * 0.22 : H * 0.20;
          const slideOffset = (1 - Math.min(1, t * 4)) * 35;

          drawRoundedRect(ctx, padX, cardY + slideOffset, cardW, cardH, 28);
          ctx.fillStyle = 'rgba(244, 245, 255, 0.10)';
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.stroke();

          if (item.scene.statNumber) {
            ctx.fillStyle = pal[2];
            ctx.font = `800 ${isVertical ? 54 : 46}px "Mona Sans", system-ui, sans-serif`;
            ctx.fillText(item.scene.statNumber, padX + 34, cardY + slideOffset + 76);
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.font = `800 ${isVertical ? 34 : 32}px "Mona Sans", system-ui, sans-serif`;
          const headlineWords = (item.scene.headline || plan.title).split(/\s+/);
          let line = '';
          let hy = cardY + slideOffset + (item.scene.statNumber ? 140 : 85);
          for (const hw of headlineWords) {
            const test = (line + ' ' + hw).trim();
            if (ctx.measureText(test).width > cardW - 68 && line) {
              ctx.fillText(line, padX + 34, hy);
              line = hw;
              hy += isVertical ? 44 : 40;
            } else {
              line = test;
            }
          }
          if (line) ctx.fillText(line, padX + 34, hy);
          ctx.restore();
        }

        // 4. Karaoke Word-by-Word Highlighted Subtitles (Bottom Band)
        ctx.save();
        const activeWordIdx = Math.min(
          words.length - 1,
          Math.floor(t * words.length)
        );
        const windowSize = isVertical ? 7 : 10;
        const chunkIdx = Math.floor(activeWordIdx / windowSize);
        const visibleWords = words.slice(
          chunkIdx * windowSize,
          (chunkIdx + 1) * windowSize
        );
        const localActive = activeWordIdx - chunkIdx * windowSize;

        const subBoxY = isVertical ? H * 0.70 : H * 0.68;
        const subBoxW = W - padX * 2;
        drawRoundedRect(ctx, padX, subBoxY, subBoxW, isVertical ? 210 : 140, 24);
        ctx.fillStyle = 'rgba(15, 18, 36, 0.78)';
        ctx.fill();

        ctx.font = `800 ${isVertical ? 34 : 30}px "Mona Sans", system-ui, sans-serif`;
        ctx.textBaseline = 'top';

        // Layout visible words centered
        const lines: { word: string; active: boolean; past: boolean }[][] = [[]];
        let currentLineW = 0;
        const maxSubW = subBoxW - 48;

        visibleWords.forEach((w, wIdx) => {
          const wWidth = ctx.measureText(w + ' ').width;
          if (currentLineW + wWidth > maxSubW && lines[lines.length - 1].length > 0) {
            lines.push([]);
            currentLineW = 0;
          }
          lines[lines.length - 1].push({
            word: w,
            active: wIdx === localActive,
            past: wIdx < localActive,
          });
          currentLineW += wWidth;
        });

        let textY = subBoxY + 34;
        for (const l of lines) {
          const lineStr = l.map((x) => x.word).join(' ');
          const totalW = ctx.measureText(lineStr).width;
          let curX = padX + (subBoxW - totalW) / 2;

          for (const token of l) {
            const tokenW = ctx.measureText(token.word).width;
            if (token.active) {
              drawRoundedRect(ctx, curX - 6, textY - 4, tokenW + 12, isVertical ? 44 : 40, 10);
              ctx.fillStyle = '#FFA143';
              ctx.fill();
              ctx.fillStyle = '#141624';
            } else if (token.past) {
              ctx.fillStyle = '#FFFFFF';
            } else {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
            }
            ctx.fillText(token.word, curX, textY);
            curX += ctx.measureText(token.word + ' ').width;
          }
          textY += isVertical ? 50 : 44;
        }
        ctx.restore();

        // 5. Bottom Progress Bar
        const overallProgress = (i + t) / preparedScenes.length;
        ctx.fillStyle = '#FFA143';
        ctx.fillRect(0, H - 8, W * overallProgress, 8);

        if (elapsed < item.durationMs) {
          requestAnimationFrame(drawFrame);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(drawFrame);
    });
  }

  osc1.stop();
  recorder.stop();
  const videoBlob = await stopPromise;
  await audioCtx.close().catch(() => {});

  const totalSec = Math.round(
    preparedScenes.reduce((acc, s) => acc + s.durationMs, 0) / 1000
  );
  const videoUrl = URL.createObjectURL(videoBlob);
  return { videoUrl, durationSec: totalSec };
}
