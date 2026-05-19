import React from 'react';
import { Download, FileText, Trash2 } from 'lucide-react';

// --- TARJETA CONTENEDORA ---
export const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden ${className}`}>
        {title && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 font-semibold bg-gray-50 dark:bg-slate-800/50">
                {title}
            </div>
        )}
        <div className="p-6">{children}</div>
    </div>
);

// --- CAMPO DE TEXTO (INPUT) ---
export const InputField = ({ icon: Icon, label, addon, className = "", ...props }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">{label}</label>}
        <div className="relative">
            {Icon && (
                <Icon className="pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 z-10" />
            )}
            <input 
                {...props}
                className={`w-full py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors 
                ${Icon ? 'pl-10' : 'pl-4'} 
                ${addon ? 'pr-32' : 'pr-4'} 
                ${className}`}
            />
            {addon && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pl-3 text-sm text-gray-500 bg-gray-100 dark:bg-slate-800 rounded-r-lg border-l border-gray-300 dark:border-slate-600">
                    {addon}
                </span>
            )}
        </div>
    </div>
);

// --- SUBIDA DE ARCHIVOS ---
export const FileUpload = ({ label, accept, file, onChange, onRemove }) => (
    <div className="w-full">
        {label && <label className="block text-sm font-medium mb-2">{label}</label>}
        
        {!file ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Download className="w-8 h-8 mb-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <p className="text-xs text-gray-500">Click o arrastrar</p>
                </div>
                <input 
                    type="file" 
                    className="hidden" 
                    accept={accept} 
                    onChange={e => e.target.files?.[0] && onChange(e.target.files[0])} 
                />
            </label>
        ) : (
            <div className="relative flex items-center p-3 border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 rounded-lg">
                <FileText className="w-8 h-8 text-green-600 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
                        {file.name}
                    </p>
                    <p className="text-xs text-green-600">
                        {(file.size / 1024).toFixed(1)} KB
                    </p>
                </div>
                {onRemove && (
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            onRemove();
                        }} 
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors ml-2"
                        title="Eliminar archivo"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        )}
    </div>
);