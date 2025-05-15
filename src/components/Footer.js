// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom'; // Usa Link de react-router si tienes páginas internas

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Obtener año actual

  return (
    // Mantenemos la ID 'contact' si la usas para react-scroll en la landing page
    <footer id="contact" className="bg-gray-800 dark:bg-black text-gray-300 dark:text-gray-400 py-8">
      <div className="container mx-auto px-4 text-center">
        {/* Puedes añadir tu logo aquí también si quieres */}
        {/* <img src="/path/to/your/logo_white.png" alt="Logo" className="h-8 mx-auto mb-4" /> */}

        <div className="flex justify-center space-x-6 mb-4">
           {/* Reemplaza '#' con las rutas reales cuando las tengas */}
          <Link to="/terms" className="hover:text-white transition duration-300">Términos y Condiciones</Link>
          <Link to="/privacy" className="hover:text-white transition duration-300">Política de Privacidad</Link>
          {/* Puedes añadir más enlaces útiles (Contacto, Soporte, etc.) */}
          {/* <Link to="/contact-us" className="hover:text-white transition duration-300">Contacto</Link> */}
        </div>

        {/* Iconos de Redes Sociales (Opcional) */}
        <div className="flex justify-center space-x-4 mb-4">
          <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white"><svg>...</svg></a>
          <a href="https://twitter.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-white"><svg>...</svg></a>
          <a href="https://linkedin.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white"><svg>...</svg></a>
        </div> 

        <p className="text-sm">&copy; {currentYear} NextManager (o NextFactura). Todos los derechos reservados.</p>
        {/* Puedes añadir información adicional si es relevante */}
        {/* <p className="text-xs mt-1">Hecho con ♡ en Culiacán</p> */}
      </div>
    </footer>
  );
}