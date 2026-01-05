/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // OBLIGATORIO en Vite: rastrear el HTML raíz
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Mantiene tu configuración de modo oscuro manual
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
        shake: 'shake 0.5s ease-in-out',
      },
      colors: {
        // Mantenemos tus colores personalizados de marca
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