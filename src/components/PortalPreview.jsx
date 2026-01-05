import React from 'react';
import { Search, Receipt, ArrowRight } from 'lucide-react';

/**
 * PortalPreview - Visualizador en tiempo real del portal de facturación.
 * Simula una ventana de navegador para mostrar cómo verán los clientes el portal.
 */
const PortalPreview = ({ config }) => {
    // Valores por defecto seguros por si config viene incompleto
    const {
        portalName = "Mi Restaurante",
        subdomain = "portal",
        primaryColor = "#3b82f6", // Azul por defecto
        logoUrl = null,
        backgroundImage = null,
        showWelcomeMessage = true,
        welcomeMessage = "Ingresa los datos de tu ticket para facturar."
    } = config || {};

    return (
        <div className="w-full max-w-4xl mx-auto transform transition-all hover:scale-[1.01] duration-500">
            {/* --- Marco del Navegador --- */}
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-slate-700 ring-1 ring-black/5">
                
                {/* Header del Navegador (Estilo Mac/Chrome) */}
                <div className="bg-gray-100 dark:bg-slate-800 px-4 py-3 flex items-center gap-4 border-b border-gray-200 dark:border-slate-700">
                    {/* Botones de ventana */}
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/50"></div>
                    </div>
                    
                    {/* Barra de Direcciones Simulada */}
                    <div className="flex-1 bg-white dark:bg-slate-900 rounded-md py-1 px-3 text-xs text-center font-mono text-gray-500 dark:text-slate-400 flex items-center justify-center gap-2 shadow-sm border border-gray-200 dark:border-slate-700">
                        <span className="text-green-500">🔒</span>
                        <span className="truncate">
                            {subdomain ? `${subdomain}.nextmanager.mx` : 'tunegocio.nextmanager.mx'}
                        </span>
                    </div>
                </div>

                {/* --- Contenido del Portal (El Preview Real) --- */}
                <div 
                    className="relative min-h-[450px] flex flex-col items-center justify-center p-8 transition-colors duration-500"
                    style={{
                        backgroundColor: backgroundImage ? 'transparent' : '#f8fafc', // Fallback color
                        // Si no hay imagen, usamos un gradiente sutil con el color primario
                        background: !backgroundImage ? `linear-gradient(to bottom right, #f8fafc, ${primaryColor}15)` : 'none'
                    }}
                >
                    {/* Imagen de Fondo + Overlay */}
                    {backgroundImage && (
                        <>
                            <div 
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
                                style={{ backgroundImage: `url(${backgroundImage})` }}
                            />
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                        </>
                    )}

                    {/* Contenedor Central (Card de Facturación) */}
                    <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                        
                        {/* Franja Superior de Color */}
                        <div className="h-2 w-full" style={{ backgroundColor: primaryColor }}></div>

                        <div className="p-8 text-center">
                            {/* Logo del Restaurante */}
                            <div className="mb-6 flex justify-center">
                                {logoUrl ? (
                                    <img 
                                        src={logoUrl} 
                                        alt="Logo" 
                                        className="h-20 w-auto object-contain drop-shadow-md"
                                    />
                                ) : (
                                    <div 
                                        className="h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {portalName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Título y Mensaje */}
                            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
                                {portalName}
                            </h1>
                            
                            {showWelcomeMessage && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
                                    {welcomeMessage}
                                </p>
                            )}

                            {/* Simulación de Formulario (Input Ticket) */}
                            <div className="space-y-4 text-left">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                        Número de Ticket
                                    </label>
                                    <div className="relative">
                                        <Receipt className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                        <input 
                                            disabled 
                                            type="text" 
                                            placeholder="Ej: A-12345"
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                {/* Botón de Acción (Usa el color primario) */}
                                <button
                                    disabled
                                    className="w-full py-3 rounded-lg text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Buscar Ticket
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Footer del Card */}
                        <div className="bg-gray-50 dark:bg-slate-800 px-6 py-3 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center text-xs text-gray-400">
                            <span>¿Necesitas ayuda?</span>
                            <span className="font-medium">Soporte</span>
                        </div>
                    </div>

                    {/* Footer "Powered By" (Fuera del card) */}
                    <div className={`mt-8 text-xs font-medium flex items-center gap-1.5 ${backgroundImage ? 'text-white/80' : 'text-gray-400'}`}>
                        <span>Powered by</span> 
                        <span className="font-bold tracking-tight">NextManager</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PortalPreview;