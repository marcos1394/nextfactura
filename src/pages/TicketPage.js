// src/pages/TicketSearch.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../context/ThemeContext';
import { TicketIcon, BuildingStorefrontIcon, ArrowRightIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon, AtSymbolIcon, UserCircleIcon } from '@heroicons/react/24/outline';


// --- MOCK DATA & HELPERS ---
const mockBrandingData = {
    name: 'El Sazón Porteño',
    logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=white',
    primaryColor: '#005DAB',
    secondaryColor: '#F3F4F6'
};

const mockFoundTicket = {
    id: 'T-84321',
    amount: 450.00,
    date: '2025-06-19',
    items: [
        { qty: 1, name: 'Tacos de Camarón', price: 150.00 },
        { qty: 2, name: 'Aguas Frescas', price: 60.00 },
        { qty: 1, name: 'Guacamole', price: 90.00 },
    ]
};

// Componente de Input reutilizable para el formulario fiscal
const FiscalInput = ({ icon: Icon, label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
        <div className="relative">
            <Icon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input {...props} className="w-full py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors pl-10 pr-4" />
        </div>
    </div>
);

/**
 * TicketSearch - Reimaginado como un asistente de facturación de autoservicio.
 * * Estrategia de UX/UI:
 * 1.  Reducción Drástica de Fricción: Se simplifica la búsqueda a un solo campo (Número de Ticket),
 * eliminando la necesidad de que el usuario recuerde el monto y la fecha. Este es el cambio de UX más impactante.
 * 2.  Flujo Guiado por Pasos: Se reemplaza el flujo de "búsqueda -> modal" por un asistente de 3 pasos
 * dentro de una única tarjeta. La transición es más fluida, moderna y mantiene al usuario enfocado.
 * 3.  Diseño Brandeado y de Confianza: El diseño central se personaliza con el logo y color del
 * restaurante, mientras que elementos como la guía visual del ticket y el pie de página "Powered by NextManager"
 * construyen confianza y profesionalismo.
 * 4.  Feedback Claro en Cada Etapa: El usuario siempre sabe en qué paso está y recibe una confirmación
 * visual clara al encontrar el ticket y al generar la factura con éxito.
 */
function TicketSearch() {
    const [branding, setBranding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [ticketNumber, setTicketNumber] = useState('');
    const [foundTicket, setFoundTicket] = useState(null);
    const [fiscalData, setFiscalData] = useState({ rfc: '', razonSocial: '', email: '' });

    // Simulación de carga de branding basado en subdominio
    useEffect(() => {
        const timer = setTimeout(() => {
            setBranding(mockBrandingData);
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Simulación de handlers
    const handleSearch = (e) => {
        e.preventDefault();
        if (!ticketNumber) return;
        console.log('Buscando ticket:', ticketNumber);
        setFoundTicket(mockFoundTicket);
        setCurrentStep(2); // Avanzar al siguiente paso
    };

    const handleGenerateInvoice = (e) => {
        e.preventDefault();
        console.log('Generando factura con datos:', fiscalData);
        setCurrentStep(3); // Avanzar al paso de éxito
    };
    
    const handleReset = () => {
        setTicketNumber('');
        setFoundTicket(null);
        setFiscalData({ rfc: '', razonSocial: '', email: '' });
        setCurrentStep(1);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><p className="text-gray-500">Cargando portal...</p></div>;
    }

    const primaryColor = branding?.primaryColor || '#005DAB';

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-white">
            <header className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto flex justify-center lg:justify-start">
                    {branding?.logoUrl && <img src={branding.logoUrl} alt={`Logo de ${branding.name}`} className="h-12 w-auto" />}
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center p-4">
                <motion.div
                    className="w-full max-w-lg bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden"
                    animate={{ height: 'auto' }}
                >
                    <AnimatePresence mode="wait">
                        {/* --- PASO 1: BÚSQUEDA DE TICKET --- */}
                        {currentStep === 1 && (
                            <motion.div key={1} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="p-8">
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold tracking-tight">{branding?.name}</h1>
                                    <p className="mt-2 text-gray-600 dark:text-slate-300">Bienvenido al portal de facturación.</p>
                                </div>
                                <form onSubmit={handleSearch} className="mt-8 space-y-4">
                                    <FiscalInput icon={TicketIcon} label="Número de Ticket" value={ticketNumber} onChange={e => setTicketNumber(e.target.value)} placeholder="Ej. A25-B7C91" required />
                                    <button type="submit" className="w-full text-lg font-semibold text-white py-3 rounded-xl transition-transform transform hover:-translate-y-1" style={{ backgroundColor: primaryColor }}>
                                        Buscar Ticket
                                    </button>
                                </form>
                                <div className="mt-6 text-center text-xs text-gray-500">
                                    <p>¿No encuentras el número? Búscalo en la parte inferior de tu recibo.</p>
                                </div>
                            </motion.div>
                        )}
                        
                        {/* --- PASO 2: DATOS FISCALES --- */}
                        {currentStep === 2 && foundTicket && (
                            <motion.div key={2} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="p-8">
                                <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-6">
                                    <h2 className="text-xl font-bold">Ticket Encontrado</h2>
                                    <div className="flex justify-between text-sm mt-2 text-gray-600 dark:text-slate-300">
                                        <p>Total: <span className="font-semibold text-gray-800 dark:text-white">${foundTicket.amount.toFixed(2)}</span></p>
                                        <p>Fecha: <span className="font-semibold text-gray-800 dark:text-white">{foundTicket.date}</span></p>
                                    </div>
                                </div>
                                <h3 className="font-semibold mb-4">Ingresa tus datos para facturar</h3>
                                <form onSubmit={handleGenerateInvoice} className="space-y-4">
                                    <FiscalInput icon={UserCircleIcon} label="RFC" name="rfc" value={fiscalData.rfc} onChange={e => setFiscalData({...fiscalData, rfc: e.target.value})} placeholder="Tu RFC" required />
                                    <FiscalInput icon={BuildingStorefrontIcon} label="Razón Social" name="razonSocial" value={fiscalData.razonSocial} onChange={e => setFiscalData({...fiscalData, razonSocial: e.target.value})} placeholder="Nombre o Razón Social" required />
                                    <FiscalInput icon={AtSymbolIcon} label="Correo para recibir factura" name="email" type="email" value={fiscalData.email} onChange={e => setFiscalData({...fiscalData, email: e.target.value})} placeholder="tu@correo.com" required />
                                    <div className="flex items-center gap-4 pt-4">
                                        <button type="button" onClick={handleReset} className="w-full text-sm font-semibold py-3 rounded-xl border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700">Buscar otro ticket</button>
                                        <button type="submit" className="w-full text-lg font-semibold text-white py-3 rounded-xl transition-transform transform hover:-translate-y-1" style={{ backgroundColor: primaryColor }}>
                                            Generar Factura <ArrowRightIcon className="inline w-5 h-5 ml-1" />
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                        
                        {/* --- PASO 3: ÉXITO --- */}
                        {currentStep === 3 && (
                            <motion.div key={3} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="p-8 text-center">
                                <CheckBadgeIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold">¡Factura Generada!</h2>
                                <p className="mt-2 text-gray-600 dark:text-slate-300">Hemos enviado la factura a <strong className="text-gray-800 dark:text-white">{fiscalData.email}</strong>. Revisa tu bandeja de entrada (y la de spam).</p>
                                <button onClick={handleReset} className="w-full mt-6 text-lg font-semibold text-white py-3 rounded-xl" style={{ backgroundColor: primaryColor }}>
                                    Facturar otro ticket
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </main>

            <footer className="py-8 text-center text-sm text-gray-500 dark:text-slate-500">
                <p>Portal de facturación <span className="font-semibold" style={{ color: primaryColor }}>Powered by NextManager</span></p>
            </footer>
        </div>
    );
}

export default TicketSearch;
