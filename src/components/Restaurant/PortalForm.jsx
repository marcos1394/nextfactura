import React, { useState, useEffect } from 'react';
import { 
    Store, 
    Globe, 
    CheckCircle2, 
    XCircle, 
    Loader2, 
    Image as ImageIcon, 
    Palette,
    AlertTriangle
} from 'lucide-react';
import { Card, InputField, FileUpload } from '../ui/FormComponents';

const PortalForm = ({ 
    config, 
    onUpdate, 
    subdomainStatus, 
    isCheckingSubdomain 
}) => {
    
    // Estado local para mensajes de advertencia de formato
    const [formatWarning, setFormatWarning] = useState(null);

    // Función de limpieza y validación en tiempo real
    const handleSubdomainChange = (e) => {
        const rawValue = e.target.value;
        let warning = null;

        // 1. ANÁLISIS: Detectar intenciones inválidas antes de limpiar
        // Esto le explica al usuario POR QUÉ se está corrigiendo su texto
        if (/[A-Z]/.test(rawValue)) {
            warning = "Las mayúsculas se convierten a minúsculas automáticamente.";
        } else if (/\s/.test(rawValue)) {
            warning = "Los espacios se convierten en guiones automáticamente.";
        } else if (/[^a-zA-Z0-9-]/.test(rawValue)) {
            warning = "Solo se permiten letras, números y guiones.";
        }

        // Si detectamos un error de formato, mostramos la advertencia
        // Si no, limpiamos la advertencia previa
        setFormatWarning(warning);

        // 2. LIMPIEZA: Sanitización estricta del valor para el estado
        const cleanValue = rawValue
            .toLowerCase()              // Todo a minúsculas
            .replace(/\s+/g, '-')       // Espacios -> Guiones
            .replace(/[^a-z0-9-]/g, '') // Eliminar caracteres especiales (ñ, @, etc)
            .replace(/-+/g, '-')        // Evitar guiones múltiples seguidos
            .slice(0, 30);              // Límite de longitud

        // 3. ACTUALIZACIÓN: Enviamos el valor ya limpio al componente padre
        onUpdate('subdomain', cleanValue);
    };

    // Efecto para ocultar la advertencia después de 4 segundos de inactividad
    useEffect(() => {
        if (formatWarning) {
            const timer = setTimeout(() => setFormatWarning(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [formatWarning]);

    return (
        <Card title="Apariencia del Portal">
            <div className="space-y-8">
                
                {/* SECCIÓN 1: Identidad Básica */}
                <div className="space-y-6">
                    <InputField 
                        icon={Store} 
                        label="Nombre del Portal Prueba Versionamiento" 
                        value={config.portalName} 
                        onChange={e => onUpdate('portalName', e.target.value)} 
                        placeholder="Ej. Restaurante La Plaza"
                    />
                    
                    <div>
                        <InputField 
                            icon={Globe} 
                            label="Dirección Web (Subdominio)" 
                            value={config.subdomain}
                            onChange={handleSubdomainChange} 
                            addon=".nextmanager.mx"
                            placeholder="mirestaurante"
                            // Feedback visual en el borde del input (Ámbar, Rojo o Verde)
                            className={`transition-colors duration-300 ${
                                formatWarning ? 'border-amber-400 focus:ring-amber-200' :
                                subdomainStatus.available === false ? 'border-red-300 focus:ring-red-200' : 
                                subdomainStatus.available === true ? 'border-green-300 focus:ring-green-200' : ''
                            }`}
                        />
                        
                        {/* ZONA DE MENSAJES: Feedback al usuario */}
                        <div className="mt-2 text-sm flex flex-col gap-1 pl-1 min-h-[1.5rem]">
                            
                            {/* Prioridad 1: Advertencia de Formato (Muestra errores de escritura) */}
                            {formatWarning && (
                                <span className="text-amber-600 flex items-center gap-1.5 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertTriangle className="w-3.5 h-3.5"/> {formatWarning}
                                </span>
                            )}

                            {/* Prioridad 2: Estado de Disponibilidad (Solo si no hay error de formato) */}
                            {!formatWarning && (
                                <>
                                    {isCheckingSubdomain && (
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin"/> 
                                            <span>Verificando disponibilidad...</span>
                                        </div>
                                    )}
                                    
                                    {!isCheckingSubdomain && subdomainStatus.available === true && (
                                        <span className="text-green-600 flex items-center gap-1.5 font-medium animate-in fade-in">
                                            <CheckCircle2 className="w-3.5 h-3.5"/> Disponible
                                        </span>
                                    )}
                                    
                                    {!isCheckingSubdomain && subdomainStatus.available === false && (
                                        <span className="text-red-500 flex items-center gap-1.5 font-medium animate-in fade-in">
                                            <XCircle className="w-3.5 h-3.5"/> No disponible
                                        </span>
                                    )}
                                    
                                    {/* Mensajes de ayuda por defecto */}
                                    {!isCheckingSubdomain && subdomainStatus.available === null && config.subdomain.length === 0 && (
                                        <span className="text-gray-400 text-xs">Tus clientes usarán esta dirección para facturar.</span>
                                    )}

                                    {!isCheckingSubdomain && subdomainStatus.available === null && config.subdomain.length > 0 && config.subdomain.length < 3 && (
                                        <span className="text-gray-400 text-xs">Escribe al menos 3 caracteres.</span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-slate-700 pt-6"></div>

                {/* SECCIÓN 2: Personalización Visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Selector de Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                            <Palette className="w-4 h-4 text-gray-400"/> Color de Marca
                        </label>
                        <div className="flex gap-3 items-center">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 shadow-sm transition-transform hover:scale-105">
                                <input 
                                    type="color" 
                                    value={config.primaryColor} 
                                    onChange={e => onUpdate('primaryColor', e.target.value)} 
                                    className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-0 p-0 m-0" 
                                />
                            </div>
                            <div className="flex-1">
                                <input 
                                    type="text" 
                                    value={config.primaryColor} 
                                    onChange={e => onUpdate('primaryColor', e.target.value)} 
                                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono uppercase focus:ring-2 focus:ring-blue-500 outline-none" 
                                    maxLength={7}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Opciones Extra */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Configuración</label>
                        <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${config.showWelcomeMessage ? 'bg-blue-600 border-blue-600' : 'bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600'}`}>
                                {config.showWelcomeMessage && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input 
                                type="checkbox" 
                                checked={config.showWelcomeMessage} 
                                onChange={e => onUpdate('showWelcomeMessage', e.target.checked)} 
                                className="hidden" 
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Mostrar mensaje de bienvenida</span>
                        </label>
                    </div>
                </div>

                {/* Subida de Logo */}
                <div className="pt-2">
                    <FileUpload 
                        label="Logotipo del Negocio" 
                        icon={ImageIcon}
                        file={config.logoFile}
                        accept="image/*"
                        onChange={f => {
                            if (f) {
                                const url = URL.createObjectURL(f);
                                onUpdate('logoFile', f);
                                onUpdate('logoUrl', url);
                            }
                        }}
                        onRemove={() => {
                            onUpdate('logoFile', null);
                            onUpdate('logoUrl', '');
                        }}
                    />
                    <p className="text-xs text-gray-400 mt-2 ml-1">
                        Recomendado: PNG con fondo transparente (500x500px)
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default PortalForm;