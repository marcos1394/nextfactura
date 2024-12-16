/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Habilita el modo oscuro basado en la clase 'dark'
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(5px, 0)' },
          '50%': { transform: 'translate(-5px, 0)' },
          '75%': { transform: 'translate(5px, 0)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out', // Definimos la animación con la duración y el easing
      },
      colors: {
        // Puedes agregar colores personalizados si es necesario
        blue: {
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}
