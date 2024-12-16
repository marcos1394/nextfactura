import React, { useState, useContext } from 'react';
import { Link } from 'react-scroll'; // Para el scroll suave a las secciones
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { ThemeContext } from '../context/ThemeContext'; // Importamos el contexto del tema

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext); // Usamos el contexto

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white dark:bg-black text-black dark:text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <img src="/images/logo.jpeg" alt="NextFactura Logo" className="w-32 h-auto" />

        <div className="hidden md:flex space-x-6">
          <Link to="hero" smooth={true} className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
            Inicio
          </Link>
          <Link to="benefits" smooth={true} className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
            Beneficios
          </Link>
          <Link to="plans" smooth={true} className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
            Planes
          </Link>
          <Link to="contact" smooth={true} className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">
            Contacto
          </Link>
        </div>

        {/* Botón de cambio de tema claro/oscuro */}
        <button onClick={toggleTheme} className="ml-4 focus:outline-none">
          {darkMode ? (
            <SunIcon className="h-8 w-8 text-yellow-500" />
          ) : (
            <MoonIcon className="h-8 w-8 text-gray-900 dark:text-white" />
          )}
        </button>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black dark:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-black z-50 flex flex-col items-center space-y-6 py-6">
          <Link to="hero" smooth={true} onClick={toggleMenu} className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
            Inicio
          </Link>
          <Link to="benefits" smooth={true} onClick={toggleMenu} className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
            Beneficios
          </Link>
          <Link to="plans" smooth={true} onClick={toggleMenu} className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
            Planes
          </Link>
          <Link to="contact" smooth={true} onClick={toggleMenu} className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
            Contacto
          </Link>
        </div>
      )}
    </header>
  );
}
