import React from 'react';
import { Palette } from 'lucide-react';

/**
 * ColorPicker - Selector de color avanzado.
 * Combina un input de texto para códigos Hex y un selector visual nativo.
 * * @param {string} label - Etiqueta del campo.
 * @param {string} name - Nombre del campo (para el formulario).
 * @param {string} value - Valor actual (ej: #ffffff).
 * @param {function} onChange - Función que recibe (name, value).
 * @param {string} className - Clases extra.
 */
const ColorPicker = ({ label, name, value, onChange, className = "" }) => {
    
    // Manejador para cuando cambian el color desde el picker visual
    const handleColorChange = (e) => {
        onChange(name, e.target.value);
    };

    // Manejador para cuando escriben el código Hex manualmente
    const handleTextChange = (e) => {
        onChange(name, e.target.value);
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-400" />
                    {label}
                </label>
            )}
            
            <div className="relative flex items-center">
                {/* 1. El Input de Texto (Visible) */}
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleTextChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase font-mono text-sm"
                    maxLength={7}
                    placeholder="#000000"
                />

                {/* 2. El Círculo de Color (Visual) */}
                <div 
                    className="absolute left-3 w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm"
                    style={{ backgroundColor: value }}
                ></div>

                {/* 3. El Input Color Nativo (Invisible pero funcional) */}
                {/* Se coloca encima del círculo para que al hacer click se abra el selector del sistema */}
                <input
                    type="color"
                    value={value}
                    onChange={handleColorChange}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default React.memo(ColorPicker);