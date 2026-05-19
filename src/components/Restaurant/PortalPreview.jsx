import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

const PortalPreview = ({ config }) => {
    const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'

    // Helper para obtener la imagen (URL o File Object)
    const getBgImage = () => {
        if (config.backgroundFile) return URL.createObjectURL(config.backgroundFile);
        return config.backgroundImage || null;
    };

    const getLogoImage = () => {
        if (config.logoFile) return URL.createObjectURL(config.logoFile);
        return config.logoUrl || null;
    };

    const bgImage = getBgImage();
    const logoImage = getLogoImage();

    return (
        <div className="flex flex-col items-center gap-6 sticky top-6">
            
            {/* --- CONTROLES DE DISPOSITIVO --- */}
            <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-lg flex items-center shadow-inner border border-gray-200 dark:border-slate-700">
                <button
                    onClick={() => setViewMode('mobile')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'mobile' 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <Smartphone className="w-4 h-4" /> Móvil
                </button>
                <button
                    onClick={() => setViewMode('desktop')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'desktop' 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <Monitor className="w-4 h-4" /> PC
                </button>
            </div>

            {/* --- CONTENEDOR DE PREVISUALIZACIÓN --- */}
            <div className="relative w-full flex justify-center items-center min-h-[500px]">
                
                {/* --- MODO MÓVIL (IPHONE STYLE) --- */}
                {viewMode === 'mobile' && (
                    <div className="border-4 border-gray-800 rounded-[2.5rem] overflow-hidden bg-gray-900 shadow-2xl w-[280px] h-[550px] transform transition-all duration-500 animate-in fade-in zoom-in-95">
                        {/* Notch */}
                        <div className="bg-gray-800 h-6 flex justify-center items-center gap-2 px-6 relative z-20">
                            <div className="w-16 h-1 bg-gray-700 rounded-full"></div>
                        </div>

                        {/* Pantalla Móvil */}
                        <div className="h-full bg-white relative overflow-hidden flex flex-col"
                             style={{ 
                                 backgroundImage: bgImage ? `url(${bgImage})` : 'none', 
                                 backgroundSize: 'cover',
                                 backgroundPosition: 'center'
                             }}
                        >
                            <PreviewContent config={config} logo={logoImage} hasBg={!!bgImage} mode="mobile" />
                        </div>
                    </div>
                )}

                {/* --- MODO DESKTOP (MACBOOK STYLE) --- */}
                {viewMode === 'desktop' && (
                    <div className="w-full max-w-[500px] transform transition-all duration-500 animate-in fade-in zoom-in-95">
                        {/* Pantalla Laptop */}
                        <div className="bg-gray-900 rounded-t-xl p-2 pb-0 shadow-2xl border border-gray-700">
                            {/* Cámara */}
                            <div className="flex justify-center mb-1">
                                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                            </div>
                            
                            {/* Área Visual */}
                            <div className="bg-white rounded-t w-full aspect-video relative overflow-hidden flex flex-col"
                                style={{ 
                                    backgroundImage: bgImage ? `url(${bgImage})` : 'none', 
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {/* Barra de Navegación Falsa */}
                                <div className={`h-6 flex items-center px-3 gap-1.5 ${bgImage ? 'bg-black/20 backdrop-blur-sm' : 'bg-gray-100 border-b'}`}>
                                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    <div className={`ml-4 text-[8px] px-2 py-0.5 rounded-md flex-1 text-center opacity-70 ${bgImage ? 'bg-white/20 text-white' : 'bg-white border text-gray-500'}`}>
                                        {config.subdomain ? `${config.subdomain}.nextmanager.mx` : 'mirestaurante.nextmanager.mx'}
                                    </div>
                                </div>

                                <PreviewContent config={config} logo={logoImage} hasBg={!!bgImage} mode="desktop" />
                            </div>
                        </div>
                        {/* Base Laptop */}
                        <div className="bg-gray-800 h-3 rounded-b-xl shadow-lg relative mx-4 border-t border-gray-700">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-b-lg"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENTE INTERNO: CONTENIDO REUTILIZABLE ---
const PreviewContent = ({ config, logo, hasBg, mode }) => {
    const isDesktop = mode === 'desktop';
    const textColor = hasBg ? 'text-white' : 'text-gray-900';
    
    return (
        <>
            {/* Capas de Fondo */}
            {!hasBg && (
                <div className="absolute inset-0 opacity-5 bg-repeat" 
                     style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                </div>
            )}
            {hasBg && <div className="absolute inset-0 bg-black/40"></div>}

            {/* Contenido Principal */}
            <div className={`flex-1 flex flex-col items-center justify-center relative z-10 w-full ${isDesktop ? 'px-12 py-4' : 'px-6 py-6'}`}>
                
                {/* Logo */}
                <div className={`relative ${isDesktop ? 'mb-4' : 'mb-6'}`}>
                    {logo ? (
                        <img 
                            src={logo} 
                            className={`${isDesktop ? 'w-16 h-16' : 'w-24 h-24'} object-contain drop-shadow-xl transition-all`} 
                            alt="Logo" 
                        />
                    ) : (
                        <div className={`${isDesktop ? 'w-14 h-14 text-sm' : 'w-20 h-20 text-xl'} bg-gray-200/80 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-gray-400 border-2 border-white/50`}>
                            LOGO
                        </div>
                    )}
                </div>

                {/* Títulos */}
                <h2 className={`${isDesktop ? 'text-xl' : 'text-2xl'} font-bold mb-1 drop-shadow-md text-center ${textColor}`}>
                    {config.portalName || 'Tu Restaurante'}
                </h2>
                
                {config.showWelcomeMessage && (
                    <p className={`text-xs opacity-90 mb-6 font-medium drop-shadow-sm text-center max-w-[80%] ${textColor}`}>
                        {config.welcomeMessage}
                    </p>
                )}
                
                {/* Botones */}
                <div className={`w-full ${isDesktop ? 'flex gap-4 max-w-xs' : 'space-y-3'}`}>
                    <div 
                        className={`h-10 w-full rounded-lg shadow-lg flex items-center justify-center font-bold text-white text-xs cursor-default transition-transform ${isDesktop ? 'hover:scale-105' : ''}`} 
                        style={{ backgroundColor: config.primaryColor }}
                    >
                        Facturar Ticket
                    </div>
                    <div className="h-10 w-full bg-white/90 text-gray-800 rounded-lg shadow-sm flex items-center justify-center font-semibold text-xs backdrop-blur-sm cursor-default">
                        Consultar Factura
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={`text-[8px] text-center opacity-50 relative z-10 pb-2 ${textColor}`}>
                Powered by NextManager
            </div>
        </>
    );
};

export default PortalPreview;