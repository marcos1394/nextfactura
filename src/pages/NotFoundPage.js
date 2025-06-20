// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

function NotFoundPage() {
    return (
        <main className="grid min-h-screen place-items-center bg-white dark:bg-slate-900 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-blue-600 dark:text-blue-400">404</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Página no encontrada</h1>
                <p className="mt-6 text-base leading-7 text-gray-600 dark:text-slate-300">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to="/dashboard" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                        Volver al Dashboard
                    </Link>
                    <Link to="/help-center" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Contactar a Soporte <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
export default NotFoundPage;
