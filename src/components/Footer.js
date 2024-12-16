import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-b from-blue-600 to-blue-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 NextFactura. Todos los derechos reservados.</p>
        <div className="space-x-4 mt-4">
          <a href="#" className="text-white hover:text-gray-300 transition">Términos y Condiciones</a>
          <a href="#" className="text-white hover:text-gray-300 transition">Política de Privacidad</a>
        </div>
      </div>
    </footer>
  );
}
