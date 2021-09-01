const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
	enabled: true,
	content: ['./**/*.html', './**/*.php'],
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
	fontFamily: {
	  sans: ['Sk-Modernist-Light'],
	  bold: ['Sk-Modernist-Bold'],
	  semibold: ['Sk-Modernist-Regular'],
	  medium: ['Sk-Modernist-Regular'],
	},
	extend: {
	  colors: {
		tertiary: {
		  100: '#ffbe7f',
		  200: '#ffaa6b',
		  300: '#ff9657',
		  400: '#ff8243',
		  500: '#eb6e2f',
		  600: '#d75a1b',
		  700: '#c34607',
		  800: '#af3200',
		  900: '#9b1e00'
		},
		accent: {
		  100: '#aeffff',
		  200: '#9affff',
		  300: '#86fff1',
		  400: '#72efdd',
		  500: '#5edbc9',
		  600: '#4ac7b5',
		  700: '#36b3a1',
		  800: '#229f8d',
		  900: '#0e8b79'
		},
		primary: {
		  100: '#dea2ff',
		  200: '#ca8eff',
		  300: '#b67aff',
		  400: '#a266f7',
		  500: '#8e52e3',
		  600: '#7a3ecf',
		  700: '#662abb',
		  800: '#5216a7',
		  900: '#3e0293'
		}
	  },
	  spacing: {
		'7': '1.75rem',
		'9': '2.25rem',
		'28': '7rem',
		'80': '20rem',
		'96': '24rem',
	  },
	  height: {
		'1/2': '50%',
	  },
	  scale: {
		'30': '.3',
	  },
	  boxShadow: {
		outline: '0 0 0 3px rgba(101, 31, 255, 0.4)',
	  },
	},
  },
  variants: {
	extend: {
	  fontWeight: ['dark', 'hover']
	},
  },
  plugins: [
	require('@tailwindcss/typography'),
	require('@tailwindcss/forms'),
  ],
}
