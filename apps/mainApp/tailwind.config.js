const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const plugin = require('tailwindcss/plugin');
const path = require('path');

module.exports = {
  content: [
    path.join(__dirname, 'src/**/*.{html,ts}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1447e6',
        secondary: '#2563eb',
        'light-text': '#f5f5f5',
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
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.outer-button': {
          border: '1px solid white',
          padding: '0.8rem 1rem',
          fontSize: '1rem',
          color: 'white',
          cursor: 'pointer',
          borderRadius: '10px',
          textTransform: 'uppercase',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          transition: 'all ease-in-out 0.3s',
          '&:hover': {
            backgroundColor: theme('colors.primary'),
            color: 'white',
            boxShadow: '0 4px 6px rgba(60, 164, 250, 0.718), 0 1px 3px rgba(0, 0, 0, 0.08)',
          },
        },
        '.inner-button': {
          backgroundColor: theme('colors.primary'),
          color: 'white',
          padding: '0.8rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '10px',
          textTransform: 'uppercase',
          transition: 'all ease-in-out 0.3s',
          '&:hover': {
            backgroundColor: '#1449e6d4',
            color: 'white',
            boxShadow: '0 4px 6px rgba(60, 164, 250, 0.718), 0 1px 3px rgba(0, 0, 0, 0.08)',
          },
        },
        '.custom-input': {
          border: `2px solid ${theme('colors.primary')}`,
          fontSize: '1rem',
          width: '100%',
          marginTop: '0.25rem',
          display: 'block',
          padding: '0.3rem',
          border: '1px solid #d1d5db',
          borderRadius: '0',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        },
      });
    }),
  ],
};
