/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
=======
  content: [
    './index.html',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
    './src/services/**/*.{js,ts,jsx,tsx}',
    './src/context/**/*.{js,ts,jsx,tsx}',
    './src/types/**/*.{js,ts,jsx,tsx}',
    './src/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)', // Maps to --primary CSS variable
        secondary: 'var(--secondary)', // Maps to --secondary CSS variable
        accent: 'var(--accent)', // Maps to --accent CSS variable
      },
    },
  },
  plugins: [],
};
>>>>>>> 079c4ae (recent changes)
