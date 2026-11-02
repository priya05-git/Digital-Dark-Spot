/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { paper: '#fff8e1', ink: '#2b2118', night: '#1d1a14', night2: '#2a251b', sun: '#ffd23f', crayon: '#e63946', sky: '#3a56d4', leaf: '#1b8a5a', amber: '#c26a00' },
    fontFamily: { doodle: ['"Chalkboard SE"', '"Comic Sans MS"', '"Segoe Print"', 'cursive', 'sans-serif'] },
    boxShadow: { doodle: '5px 5px 0 #2b2118', doodleDark: '5px 5px 0 #fff4d6', btn: '3px 3px 0 #2b2118' }
  } },
  plugins: []
};
