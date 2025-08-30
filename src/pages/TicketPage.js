import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TicketIcon, BuildingStorefrontIcon, ArrowRightIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { DocumentTextIcon, AtSymbolIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// --- SUBCOMPONENTES DE UI ---

const FiscalInput = ({ icon: Icon, label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
        <div className="relative">
            <Icon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
            <input {...props} className="w-full py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors pl-10 pr-4" />
        </div>
    </div>
);

const Loader = () => (
    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);


// --- COMPONENTE PRINCIPAL ---

function TicketSearch() {
    const [branding, setBranding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [ticketNumber, setTicketNumber] = useState('');
    const [foundTicket, setFoundTicket] = useState(null);
    const [fiscalData, setFiscalData] = useState({ rfc: '', razonSocial: '', email: '' });
    const [error, setError] = useState('');
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');

   // En src/pages/TicketSearch.js

useEffect(() => {
    const fetchPortalData = async () => {
        setIsLoading(true);
        try {
            // Para las pruebas, en lugar de usar un ID fijo, llamaremos al endpoint
            // que nos da toda la información de la cuenta, incluyendo todas las sucursales.
            const response = await fetch(`/api/auth/account-details`, {
                headers: { 'Authorization': localStorage.getItem('authToken') }
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'No se pudo cargar la información del portal.');
            }

            const accountData = data.data;

            if (!accountData.restaurants || accountData.restaurants.length === 0) {
                throw new Error("No se encontraron restaurantes para este propietario.");
            }

            // --- LÓGICA CORREGIDA ---
            // 1. Guardamos la lista completa de restaurantes (sucursales) en el estado
            setAllRestaurants(accountData.restaurants);

            // 2. Asumimos que el branding principal es el del primer restaurante de la lista
            const mainRestaurant = accountData.restaurants[0];
            
            // 3. Obtenemos los datos de PortalConfig para el branding
            // (Esta llamada adicional asegura que tenemos los datos de personalización)
            const brandingResponse = await fetch(`/api/restaurants/public/data/${mainRestaurant.id}`);
            const brandingJson = await brandingResponse.json();
            if (!brandingJson.success) throw new Error("No se pudo cargar la configuración del portal.");
            
            const restaurantBranding = brandingJson.restaurant;

            const brandingData = {
                restaurantId: restaurantBranding.id,
                name: restaurantBranding.PortalConfig?.portalName || restaurantBranding.name,
                logoUrl: restaurantBranding.PortalConfig?.logoUrl,
                primaryColor: restaurantBranding.PortalConfig?.primaryColor || '#005DAB'
            };
            setBranding(brandingData);
            
            // 4. Pre-seleccionamos el primer restaurante de la lista en el selector
            setSelectedRestaurantId(mainRestaurant.id);

        } catch (err) {
            console.error("Error fetching portal data:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchPortalData();
}, []);

    const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketNumber || !selectedRestaurantId) {
        setError('Por favor, selecciona una sucursal y escribe un número de ticket.');
        return;
    }
    setError('');
    setIsSubmitting(true);
    try {
        // La URL ahora usa la variable 'selectedRestaurantId' del estado
        const response = await fetch(`/api/restaurants/portal/${selectedRestaurantId}/search-ticket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticketNumber }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Ticket no encontrado o inválido.');
        }
        setFoundTicket(data.ticket);
        setCurrentStep(2);
    } catch (err) {
        setError(err.message);
    } finally {
        setIsSubmitting(false);
    }
};

    const handleGenerateInvoice = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/restaurants/portal/${branding.restaurantId}/generate-invoice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticket: foundTicket, fiscalData }),
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'No se pudo generar la factura.');
            }
            setCurrentStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleReset = () => {
        setTicketNumber('');
        setFoundTicket(null);
        setFiscalData({ rfc: '', razonSocial: '', email: '' });
        setError('');
        setCurrentStep(1);
    };

    if (isLoading) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><p className="text-gray-500">Cargando portal...</p></div>;
    }

    if (error && !branding) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><p className="text-red-500 text-center p-4">{error}</p></div>;
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
                className="w-full max-w-lg bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden relative"
                animate={{ height: 'auto' }}
            >
                <AnimatePresence>
                    {isSubmitting && <Loader />}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                    {/* --- PASO 1: BÚSQUEDA DE TICKET --- */}
                    {currentStep === 1 && (
                        <motion.div key={1} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4, ease: 'easeInOut' }} className="p-8">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold tracking-tight">{branding?.name}</h1>
                                <p className="mt-2 text-gray-600 dark:text-slate-300">Bienvenido al portal de facturación.</p>
                            </div>
                            <form onSubmit={handleSearch} className="mt-8 space-y-4">
                                
                                {/* --- SELECTOR DE SUCURSALES AÑADIDO --- */}
                                {allRestaurants.length > 1 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                            Selecciona la Sucursal
                                        </label>
                                        <select
                                            value={selectedRestaurantId}
                                            onChange={e => setSelectedRestaurantId(e.target.value)}
                                            className="w-full py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors px-3"
                                        >
                                            {allRestaurants.map(restaurant => (
                                                <option key={restaurant.id} value={restaurant.id}>
                                                    {restaurant.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <FiscalInput icon={TicketIcon} label="Número de Ticket" value={ticketNumber} onChange={e => setTicketNumber(e.target.value)} placeholder="Ej. A25-B7C91" required />
                                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                                <button type="submit" disabled={isSubmitting} className="w-full text-lg font-semibold text-white py-3 rounded-xl transition-transform transform hover:-translate-y-1 disabled:opacity-50" style={{ backgroundColor: primaryColor }}>
                                    {isSubmitting ? 'Buscando...' : 'Buscar Ticket'}
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
                                    <p>Fecha: <span className="font-semibold text-gray-800 dark:text-white">{new Date(foundTicket.date).toLocaleDateString()}</span></p>
                                </div>
                            </div>
                            <h3 className="font-semibold mb-4">Ingresa tus datos para facturar</h3>
                            <form onSubmit={handleGenerateInvoice} className="space-y-4">
                                <FiscalInput icon={UserCircleIcon} label="RFC" name="rfc" value={fiscalData.rfc} onChange={e => setFiscalData({...fiscalData, rfc: e.target.value.toUpperCase()})} placeholder="Tu RFC" required />
                                <FiscalInput icon={BuildingStorefrontIcon} label="Razón Social" name="razonSocial" value={fiscalData.razonSocial} onChange={e => setFiscalData({...fiscalData, razonSocial: e.target.value})} placeholder="Nombre o Razón Social" required />
                                <FiscalInput icon={AtSymbolIcon} label="Correo para recibir factura" name="email" type="email" value={fiscalData.email} onChange={e => setFiscalData({...fiscalData, email: e.target.value})} placeholder="tu@correo.com" required />
                                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                                <div className="flex items-center gap-4 pt-4">
                                    <button type="button" onClick={handleReset} disabled={isSubmitting} className="w-full text-sm font-semibold py-3 rounded-xl border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50">Buscar otro ticket</button>
                                    <button type="submit" disabled={isSubmitting} className="w-full text-lg font-semibold text-white py-3 rounded-xl transition-transform transform hover:-translate-y-1 disabled:opacity-50" style={{ backgroundColor: primaryColor }}>
                                        {isSubmitting ? 'Generando...' : 'Generar Factura'} <ArrowRightIcon className="inline w-5 h-5 ml-1" />
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
                            <p className="mt-2 text-gray-600 dark:text-slate-300">Hemos enviado la factura a <strong className="text-gray-800 dark:text-white">{fiscalData.email}</strong>. Revisa tu bandeja de entrada.</p>
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