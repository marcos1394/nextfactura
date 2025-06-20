// src/pages/HelpCenterPage.js
import React from 'react';
import { LifebuoyIcon, MagnifyingGlassIcon, BookOpenIcon, CogIcon, CreditCardIcon } from '@heroicons/react/24/solid';

const helpCategories = [
    { name: 'Primeros Pasos', description: 'Configura tu cuenta y restaurantes.', icon: BookOpenIcon, href: '#' },
    { name: 'Facturación', description: 'Todo sobre cómo generar y gestionar facturas.', icon: CreditCardIcon, href: '#' },
    { name: 'Gestión de Cuenta', description: 'Actualiza tu perfil, plan y seguridad.', icon: CogIcon, href: '#' },
];

const popularArticles = [
    { title: '¿Cómo configuro mi primer restaurante?', href: '#' },
    { title: '¿Por qué no se pueden cargar mis archivos CSD?', href: '#' },
    { title: '¿Cómo puedo cambiar mi plan?', href: '#' },
    { title: '¿Es seguro conectar mi base de datos de SoftRestaurant?', href: '#' },
];

function HelpCenterPage() {
    return (
        <div className="bg-white dark:bg-slate-900/50 min-h-full">
            {/* Cabecera con barra de búsqueda */}
            <div className="bg-slate-800 p-8 sm:p-12">
                <div className="max-w-3xl mx-auto text-center">
                    <LifebuoyIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white">Centro de Ayuda</h1>
                    <p className="mt-2 text-lg text-slate-300">¿Tienes alguna pregunta? Estamos aquí para ayudarte.</p>
                    <div className="mt-6 relative">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Busca en nuestros artículos (ej. 'cambiar contraseña')"
                            className="w-full p-4 pl-12 rounded-full bg-slate-700 text-white border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Categorías */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explorar por Categoría</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {helpCategories.map(category => (
                            <a key={category.name} href={category.href} className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                                <category.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{category.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{category.description}</p>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Artículos Populares */}
                <section className="mt-16">
                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Artículos Populares</h2>
                     <div className="space-y-4">
                        {popularArticles.map(article => (
                            <a key={article.title} href={article.href} className="block p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                <p className="font-medium text-blue-600 dark:text-blue-400">{article.title}</p>
                            </a>
                        ))}
                     </div>
                </section>
            </div>
        </div>
    );
}

export default HelpCenterPage;
