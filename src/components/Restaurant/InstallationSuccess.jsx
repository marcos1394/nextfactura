import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, 
    Copy, 
    Check, 
    Download, 
    AlertTriangle, 
    ArrowRight,
    Monitor,
    Loader2,
    FileBox // Icono para representar el .msi
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api'; // Importamos la instancia de API configurada con interceptores

const InstallationSuccess = ({ restaurantName, agentKey, onFinish }) => {
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [osWarning, setOsWarning] = useState(false);

    // 1. Detección de Sistema Operativo (UX)
    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('win') === -1) {
            setOsWarning(true);
        }
    }, []);

    // 2. Copiado Robusto al Portapapeles
    const handleCopy = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(agentKey);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = agentKey;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            setCopied(true);
            toast.success("¡Clave copiada!", { position: "bottom-center" });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
            toast.error("No se pudo copiar. Selecciónala manualmente.");
        }
    };

    // 3. Descarga Segura Autenticada (BLOB)
    const handleDownload = async () => {
        setIsDownloading(true);
        
        try {
            // Hacemos la petición con el token (manejado por api instance)
            // Es CRUCIAL el responseType: 'blob' para archivos binarios (.msi, .pdf, etc)
            const response = await api.get('/connector/download', {
                responseType: 'blob' 
            });

            // Crear una URL temporal para el archivo en memoria del navegador
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // Crear un elemento <a> invisible para forzar la descarga
            const link = document.createElement('a');
            link.href = url;
            
            // Nombre del archivo sugerido al guardar
            link.setAttribute('download', 'NextFactura_Connector_Setup.msi'); 
            
            document.body.appendChild(link);
            link.click();
            
            // Limpieza
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Descarga iniciada exitosamente.", {
                icon: <Download className="text-blue-500"/>
            });

        } catch (error) {
            console.error("Error en descarga:", error);
            
            // Manejo de errores específicos (ej: si el usuario perdió la sesión o el plan)
            if (error.response && error.response.status === 403) {
                toast.error("No tienes permisos o tu plan ha expirado.");
            } else {
                toast.error("Error al descargar el instalador. Contacta soporte.");
            }
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl mx-auto py-8 px-4"
        >
            {/* Header Animado */}
            <div className="text-center space-y-6 mb-10">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="bg-green-100 dark:bg-green-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20 ring-4 ring-white dark:ring-slate-900"
                >
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                </motion.div>

                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                        ¡{restaurantName} creado con éxito!
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Tu sucursal está lista. Ahora conecta tu servidor local.
                    </p>
                </div>
            </div>

            {/* Tarjeta Principal */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                
                {/* Header de la Tarjeta */}
                <div className="bg-gray-50 dark:bg-slate-800/50 px-8 py-6 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <Monitor className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Instalador de Conector</h3>
                            <p className="text-sm text-gray-500 dark:text-slate-400">Versión 1.0.0 (Windows MSI)</p>
                        </div>
                    </div>
                    {osWarning && (
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Windows Requerido
                        </div>
                    )}
                </div>

                <div className="p-8 space-y-8">
                    
                    {/* PASO 1: Descarga */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold shadow-sm ring-2 ring-white dark:ring-slate-800">1</span>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Descarga el Conector</h4>
                        </div>
                        
                        <div className="pl-10 md:pl-12">
                            <button 
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="w-full md:w-auto group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 px-8 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Descargando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span>Descargar Instalador (.msi)</span>
                                    </>
                                )}
                            </button>
                            <p className="mt-3 text-xs text-gray-400 flex items-center gap-1.5">
                                <FileBox className="w-3.5 h-3.5" />
                                Instalador seguro para SoftRestaurant 9.5+
                            </p>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-slate-700 mx-4" />

                    {/* PASO 2: Clave */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold shadow-sm ring-2 ring-white dark:ring-slate-800">2</span>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Copia tu Clave de Agente</h4>
                        </div>
                        
                        <div className="pl-10 md:pl-12">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-mono text-xs font-bold tracking-wider">KEY</span>
                                </div>
                                <input 
                                    readOnly
                                    value={agentKey}
                                    className="w-full pl-12 pr-14 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl font-mono text-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center md:text-left shadow-inner select-all"
                                    onClick={(e) => e.target.select()}
                                />
                                <button 
                                    onClick={handleCopy}
                                    className="absolute inset-y-1.5 right-1.5 px-3 flex items-center justify-center bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-500 dark:text-slate-300 transition-all shadow-sm active:scale-95"
                                    title="Copiar al portapapeles"
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {copied ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                            >
                                                <Check className="w-5 h-5 text-green-500" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                            >
                                                <Copy className="w-5 h-5" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                            
                            <div className="mt-4 flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-500">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p className="leading-snug">
                                    El instalador te pedirá esta clave para vincularse. <br className="hidden md:block"/>
                                    <strong>No la compartas</strong> con nadie fuera de tu organización.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <button 
                    onClick={onFinish}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors px-6 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                    Ir al Dashboard <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </motion.div>
    );
};

export default InstallationSuccess;