import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Ticket, 
    QrCode, 
    Search, 
    Store, 
    Phone, 
    Mail, 
    MapPin, 
    ArrowRight 
} from 'lucide-react';

/**
 * PortalFacturacionTemplate - Plantilla maestra para el portal del cliente.
 * Diseñada para ser marca blanca (White Label), adaptándose a la configuración del restaurante.
 */
const PortalFacturacionTemplate = ({
    logo = null, // URL del logo
    nombreRestaurante = 'Restaurante Demo',
    colorPrimario = '#0f172a', // Slate-900 por defecto
    textoHero = 'Factura tu consumo en segundos',
    datosRestaurante = {
        direccion: 'Calle Principal #123, Ciudad de México',
        telefono: '55 1234 5678',
        correo: 'facturacion@restaurante.com'
    },
    backgroundImage = null // Opcional: Imagen de fondo
}) => {
    const [ticket, setTicket] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleBuscarTicket = (e) => {
        e.preventDefault();
        if (!ticket) return;
        
        setIsSearching(true);
        // Simulación de búsqueda
        setTimeout(() => {
            alert(`Buscando ticket: ${ticket}`);
            setIsSearching(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors">
            
            {/* Imagen de fondo (Opcional con Overlay) */}
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                    <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"></div>
                </div>
            )}

            {/* --- HEADER --- */}
            <header className="relative z-10 w-full py-6 px-6">
                <div className="max-w-7xl mx-auto flex justify-center lg:justify-start">
                    {logo ? (
                        <img src={logo} alt={nombreRestaurante} className="h-12 w-auto object-contain" />
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white shadow-sm">
                                <Store className="w-6 h-6" style={{ color: colorPrimario }} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">{nombreRestaurante}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-lg"
                >
                    {/* Tarjeta Principal */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-slate-700 overflow-hidden">
                        
                        {/* Franja superior de color */}
                        <div className="h-2 w-full" style={{ backgroundColor: colorPrimario }}></div>

                        <div className="p-8 sm:p-10">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                                    Bienvenido
                                </h1>
                                <p className="text-lg text-gray-500 dark:text-slate-400 font-medium">
                                    {textoHero}
                                </p>
                            </div>

                            <form onSubmit={handleBuscarTicket} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="ticket" className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1 uppercase tracking-wide">
                                        Número de Ticket
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors">
                                            <Ticket className="w-6 h-6" />
                                        </div>
                                        <input
                                            type="text"
                                            id="ticket"
                                            value={ticket}
                                            onChange={(e) => setTicket(e.target.value)}
                                            placeholder="Ej: A-123456"
                                            className="w-full pl-14 pr-4 py-4 text-lg bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none transition-all placeholder:text-gray-400 font-mono"
                                            style={{ 
                                                // Truco para aplicar el color dinámico al foco sin usar clases estáticas
                                                '--focus-color': colorPrimario 
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = colorPrimario}
                                            onBlur={(e) => e.target.style.borderColor = ''}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSearching}
                                    className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3"
                                    style={{ backgroundColor: colorPrimario }}
                                >
                                    {isSearching ? (
                                        'Buscando...'
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5" />
                                            Buscar Ticket
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white dark:bg-slate-800 text-gray-400 font-medium">o también puedes</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="w-full py-3.5 rounded-2xl border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
                            >
                                <QrCode className="w-6 h-6" />
                                Escanear Código QR
                            </button>
                        </div>

                        {/* Footer de Ayuda Visual */}
                        <div className="bg-gray-50 dark:bg-slate-900/50 p-6 border-t border-gray-100 dark:border-slate-700">
                            <div className="flex items-start gap-4">
                                <div className="hidden sm:block p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm">
                                    <Ticket className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">¿Dónde está mi número?</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 mb-2">
                                        Busca al final de tu recibo impreso el código alfanumérico etiquetado como "Folio" o "Ticket".
                                    </p>
                                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-xs font-mono text-gray-600 dark:text-slate-300">
                                        <span>Ejemplo:</span>
                                        <span className="font-bold" style={{ color: colorPrimario }}>A25-99</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer de Contacto del Restaurante */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-12 text-center max-w-2xl mx-auto"
                >
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Contacto</h3>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-gray-600 dark:text-slate-400">
                        {datosRestaurante.telefono && (
                            <a href={`tel:${datosRestaurante.telefono}`} className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <Phone className="w-4 h-4" /> {datosRestaurante.telefono}
                            </a>
                        )}
                        {datosRestaurante.correo && (
                            <a href={`mailto:${datosRestaurante.correo}`} className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <Mail className="w-4 h-4" /> {datosRestaurante.correo}
                            </a>
                        )}
                    </div>
                    {datosRestaurante.direccion && (
                        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-slate-500">
                            <MapPin className="w-4 h-4" /> {datosRestaurante.direccion}
                        </div>
                    )}
                </motion.div>

            </main>

            {/* --- FOOTER GLOBAL --- */}
            <footer className="relative z-10 py-6 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full border border-gray-200/50 dark:border-slate-700/50 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Powered by</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-slate-200 flex items-center gap-1">
                        NextManager <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </footer>

        </div>
    );
};

export default PortalFacturacionTemplate;