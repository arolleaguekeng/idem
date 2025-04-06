const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1447e6',
        secondary: '#2563eb', // blue-600
        lightText: '#f5f5f5',
        success: '#219653',
        danger: '#d34053',
        warning: '#ffa70b',
      },
      fontSize: {
        title: '5.4rem',
        'title-mobile': '1.4rem',
        subtitle: '1.7rem',
        'light-text': '1rem',
      },
      borderRadius: {
        xl: '10px',
      },
      boxShadow: {
        custom: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        hover: '0 4px 6px rgba(60, 164, 250, 0.718), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.outer-button': {
          border: '1px solid white',
          padding: '0.8rem 1rem',
          fontSize: '1rem',
          color: 'white',
          cursor: 'pointer',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
          textTransform: 'uppercase',
          transition: 'all ease-in-out 0.3s',
        },
        '.outer-button:hover': {
          backgroundColor: '#1447e6',
          boxShadow: '0 4px 6px rgba(60, 164, 250, 0.718), 0 1px 3px rgba(0,0,0,0.08)',
          color: 'white',
        },
        '.inner-button': {
          backgroundColor: '#1447e6',
          color: 'white',
          padding: '0.8rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '10px',
          textTransform: 'uppercase',
          transition: 'all ease-in-out 0.3s',
        },
        '.inner-button:hover': {
          backgroundColor: '#1449e6d4',
          boxShadow: '0 4px 6px rgba(60, 164, 250, 0.718), 0 1px 3px rgba(0,0,0,0.08)',
          color: 'white',
        },
        '.custom-input': {
          border: '2px solid #1447e6',
          fontSize: '1rem',
          width: '100%',
          marginTop: '0.25rem',
          display: 'block',
          padding: '0.3rem',
          borderRadius: '0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
        },
      });
    }]
};