import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Ticket, 
    Search, 
    ArrowRight, 
    CheckCircle2, 
    Building2, 
    Mail, 
    FileText, 
    Store,
    RefreshCw,
    Download
} from 'lucide-react';

// --- SUBCOMPONENTES ---

const PortalInput = ({ label, icon: Icon, color, ...props }) => (
    <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 ml-1">
            {label}
        </label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors">
                <Icon className="w-5 h-5" />
            </div>
            <input 
                {...props} 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                style={{ '--tw-ring-color': color }} 
            />
        </div>
    </div>
);

const Loader = ({ color }) => (
    <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 border-4 border-gray-200 rounded-full border-t-transparent"
            style={{ borderTopColor: color }}
        />
        <p className="mt-4 text-sm font-medium text-gray-600 dark:text-slate-300">Procesando...</p>
    </div>
);

// --- COMPONENTE PRINCIPAL ---

function TicketSearch() {
    // --- ESTADOS ---
    const [branding, setBranding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Pasos: 1 (Buscar), 2 (Datos), 3 (Éxito)
    const [currentStep, setCurrentStep] = useState(1);
    
    // Datos
    const [ticketNumber, setTicketNumber] = useState('');
    const [foundTicket, setFoundTicket] = useState(null);
    const [fiscalData, setFiscalData] = useState({ rfc: '', razonSocial: '', email: '' });
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
    const [error, setError] = useState('');

    // --- EFECTOS ---
    useEffect(() => {
        const fetchPortalData = async () => {
            setIsLoading(true);
            try {
                // 1. Obtener detalles de la cuenta (Simulación de multi-tenancy)
                const response = await fetch(`/api/auth/account-details`, {
                    headers: { 'Authorization': localStorage.getItem('authToken') }
                });
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'No se pudo cargar la información.');
                }

                const accountData = data.data;
                if (!accountData.restaurants?.length) {
                    throw new Error("No hay restaurantes configurados.");
                }

                setAllRestaurants(accountData.restaurants);

                // 2. Configurar Branding (Usamos el primero como principal)
                const mainRestaurant = accountData.restaurants[0];
                
                // Llamada para obtener configuración específica (colores, logo)
                const brandingResponse = await fetch(`/api/restaurants/public/data/${mainRestaurant.id}`);
                const brandingJson = await brandingResponse.json();
                
                if (!brandingJson.success) throw new Error("Error cargando configuración.");
                
                const rData = brandingJson.restaurant;
                setBranding({
                    restaurantId: rData.id,
                    name: rData.PortalConfig?.portalName || rData.name,
                    logoUrl: rData.PortalConfig?.logoUrl,
                    primaryColor: rData.PortalConfig?.primaryColor || '#2563EB', // Azul default
                    secondaryColor: rData.PortalConfig?.secondaryColor || '#1E293B',
                    backgroundImage: rData.PortalConfig?.backgroundImage
                });

                setSelectedRestaurantId(mainRestaurant.id);

            } catch (err) {
                console.error("Portal Error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortalData();
    }, []);

    // --- HANDLERS ---

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!ticketNumber || !selectedRestaurantId) {
            setError('Selecciona una sucursal e ingresa el ticket.');
            return;
        }
        
        setError('');
        setIsSubmitting(true);
        
        try {
            const response = await fetch(`/api/restaurants/portal/${selectedRestaurantId}/search-ticket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketNumber }),
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Ticket no encontrado.');
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
                throw new Error(data.message || 'Error al generar factura.');
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

    // --- RENDER ---

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Cargando portal...</p>
                </div>
            </div>
        );
    }

    if (error && !branding) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center max-w-md">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <Store className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Servicio No Disponible</h3>
                    <p className="text-gray-500 dark:text-slate-400">{error}</p>
                </div>
            </div>
        );
    }

    const brandColor = branding?.primaryColor || '#2563EB';

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-white transition-colors">
            
            {/* Background Image (Optional) */}
            {branding?.backgroundImage && (
                <div 
                    className="absolute inset-0 z-0 opacity-10 bg-cover bg-center"
                    style={{ backgroundImage: `url(${branding.backgroundImage})` }}
                />
            )}

            {/* --- HEADER --- */}
            <header className="relative z-10 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {branding?.logoUrl ? (
                            <img src={branding.logoUrl} alt={branding.name} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: brandColor }}>
                                {branding.name.charAt(0)}
                            </div>
                        )}
                        <span className="font-bold text-xl tracking-tight hidden sm:block">{branding.name}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                        Facturación en Línea
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="relative z-10 flex-grow flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                    className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Barra de progreso superior */}
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700">
                        <motion.div 
                            className="h-full"
                            style={{ backgroundColor: brandColor }}
                            initial={{ width: '33%' }}
                            animate={{ width: `${currentStep * 33.33}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <div className="p-8 sm:p-10 relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {isSubmitting && <Loader color={brandColor} />}

                            {/* --- PASO 1: BÚSQUEDA --- */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bienvenido</h1>
                                        <p className="text-gray-500 dark:text-slate-400 mt-2">Ingresa los datos de tu ticket para comenzar.</p>
                                    </div>

                                    <form onSubmit={handleSearch} className="space-y-5">
                                        {allRestaurants.length > 1 && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 ml-1">
                                                    Sucursal
                                                </label>
                                                <div className="relative">
                                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                                    <select
                                                        value={selectedRestaurantId}
                                                        onChange={e => setSelectedRestaurantId(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 appearance-none transition-all cursor-pointer"
                                                        style={{ '--tw-ring-color': brandColor }}
                                                    >
                                                        {allRestaurants.map(r => (
                                                            <option key={r.id} value={r.id}>{r.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        <PortalInput 
                                            label="Número de Ticket" 
                                            icon={Ticket} 
                                            placeholder="Ej: A-12345" 
                                            value={ticketNumber}
                                            onChange={e => setTicketNumber(e.target.value)}
                                            color={brandColor}
                                            required
                                        />

                                        {error && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
                                                {error}
                                            </motion.div>
                                        )}

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            <Search className="w-5 h-5" />
                                            Buscar Ticket
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* --- PASO 2: DATOS FISCALES --- */}
                            {currentStep === 2 && foundTicket && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Ticket Preview Card */}
                                    <div className="bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 relative">
                                        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-white dark:bg-slate-800 rounded-full" />
                                        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white dark:bg-slate-800 rounded-full" />
                                        
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Resumen del Consumo</h3>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    ${foundTicket.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className="text-sm text-gray-500">{new Date(foundTicket.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Verificado
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handleGenerateInvoice} className="space-y-4">
                                        <PortalInput 
                                            label="RFC" 
                                            icon={FileText} 
                                            placeholder="XAXX010101000" 
                                            value={fiscalData.rfc}
                                            onChange={e => setFiscalData({...fiscalData, rfc: e.target.value.toUpperCase()})}
                                            color={brandColor}
                                            required
                                        />
                                        <PortalInput 
                                            label="Razón Social" 
                                            icon={Building2} 
                                            placeholder="Nombre o Empresa S.A." 
                                            value={fiscalData.razonSocial}
                                            onChange={e => setFiscalData({...fiscalData, razonSocial: e.target.value})}
                                            color={brandColor}
                                            required
                                        />
                                        <PortalInput 
                                            label="Correo Electrónico" 
                                            icon={Mail} 
                                            type="email"
                                            placeholder="facturas@empresa.com" 
                                            value={fiscalData.email}
                                            onChange={e => setFiscalData({...fiscalData, email: e.target.value})}
                                            color={brandColor}
                                            required
                                        />

                                        <div className="pt-2 flex gap-3">
                                            <button 
                                                type="button" 
                                                onClick={handleReset}
                                                className="w-1/3 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-700 font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                Volver
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="w-2/3 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                                style={{ backgroundColor: brandColor }}
                                            >
                                                Generar Factura
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* --- PASO 3: ÉXITO --- */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                                    </div>
                                    
                                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">¡Factura Lista!</h2>
                                    <p className="text-gray-600 dark:text-slate-300 mb-8 max-w-xs mx-auto">
                                        Hemos enviado los archivos XML y PDF a <span className="font-semibold text-gray-900 dark:text-white">{fiscalData.email}</span>.
                                    </p>

                                    <div className="space-y-3">
                                        {/* Simulación de botones de descarga */}
                                        <button className="w-full py-3 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-center gap-2 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                            <Download className="w-4 h-4" /> Descargar PDF
                                        </button>
                                        
                                        <button 
                                            onClick={handleReset}
                                            className="w-full py-3 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all"
                                            style={{ backgroundColor: brandColor }}
                                        >
                                            Facturar otro ticket
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="relative z-10 py-6 text-center text-xs text-gray-400 dark:text-slate-600">
                <p>
                    Powered by <span className="font-bold text-gray-500 dark:text-slate-500">NextManager</span>
                </p>
            </footer>
        </div>
    );
}

export default TicketSearch;