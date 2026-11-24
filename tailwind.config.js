/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Mona Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        body: ['"Mona Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sovereign: {
          bg: '#E9ECF8',
          surface: '#F4F5FF',
          white: '#FFFFFF',
          primary: '#4D5BAF',
          primaryLight: '#717CBF',
          primarySoft: '#EEF0FB',
          amber: '#FFA143',
          amberSoft: '#FFF3E6',
          yellow: '#FFD12E',
          teal: '#11C6C2',
          tealSoft: '#E6FAFA',
          validBg: '#F0FCED',
          validText: '#58B947',
          invalidBg: '#FBECE6',
          invalidText: '#E86E4B',
        },
      },
    },
  },
  plugins: [],
};
