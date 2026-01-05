import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

/**
 * FileUpload - Componente de carga de archivos con Drag & Drop.
 * * @param {string} label - Título del campo.
 * @param {string} accept - Tipos de archivo permitidos (ej: "image/*, .pdf").
 * @param {File} file - El objeto File seleccionado actualmente.
 * @param {function} onChange - Función que recibe el archivo (o null si se elimina).
 * @param {string} helperText - Texto de ayuda (ej: "Máx 5MB, JPG o PNG").
 */
const FileUpload = ({ label, accept, file, onChange, helperText }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    // --- Manejadores de Drag & Drop ---
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            onChange(droppedFile);
        }
    };

    // --- Manejadores de Input ---
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            onChange(selectedFile);
        }
    };

    const handleRemoveFile = (e) => {
        e.preventDefault(); // Evita abrir el explorador de archivos
        e.stopPropagation();
        onChange(null); // Limpia el estado en el padre
        if (inputRef.current) inputRef.current.value = ''; // Resetea el input
    };

    // Helper para formato de tamaño
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {label}
                </label>
            )}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="relative"
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    id={`file-upload-${label}`}
                />

                <label
                    htmlFor={`file-upload-${label}`}
                    className={`
                        flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6
                        border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                        ${isDragging 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[0.99]' 
                            : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/50'}
                        ${file ? 'border-green-400 bg-green-50/50 dark:border-green-500/50 dark:bg-green-900/10' : ''}
                    `}
                >
                    {file ? (
                        // --- ESTADO: ARCHIVO SELECCIONADO ---
                        <div className="w-full flex items-center gap-4 p-2">
                            {/* Icono del archivo */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-green-500">
                                {file.type.startsWith('image/') ? <ImageIcon className="w-6 h-6"/> : <FileText className="w-6 h-6"/>}
                            </div>
                            
                            {/* Detalles */}
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                    {formatFileSize(file.size)}
                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                    <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-0.5">
                                        <CheckCircle2 className="w-3 h-3" /> Listo
                                    </span>
                                </p>
                            </div>

                            {/* Botón Eliminar */}
                            <button
                                onClick={handleRemoveFile}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                title="Eliminar archivo"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        // --- ESTADO: VACÍO (INVITACIÓN A SUBIR) ---
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className={`
                                p-3 rounded-full mb-3 transition-colors
                                ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-400'}
                            `}>
                                <UploadCloud className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                <span className="text-blue-600 hover:underline">Haz clic para subir</span> o arrastra aquí
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                {helperText || `Soporta: ${accept ? accept.replace(/,/g, ', ') : 'Cualquier archivo'}`}
                            </p>
                        </div>
                    )}
                </label>
            </div>
        </div>
    );
};

export default FileUpload;