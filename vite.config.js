import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Aumentamos el límite de advertencia para que no moleste por archivos grandes
    chunkSizeWarningLimit: 1600, 
    rollupOptions: {
      output: {
        // ESTA ES LA CLAVE: Separamos las librerías en archivos distintos
        manualChunks(id) {
          // 1. Aísla lucide-react (el culpable principal) en su propio archivo
          if (id.includes('lucide-react')) {
            return 'lucide-icons';
          }
          // 2. Aísla react y framer-motion en otro archivo "vendor"
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'framer';
            }
            // El resto de node_modules va aquí
            return 'vendor';
          }
        },
      },
    },
  },
});