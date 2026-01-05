import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * InputField - Campo de texto versátil y estilizado.
 * Características:
 * - Soporte nativo para modo oscuro.
 * - Iconos a la izquierda.
 * - Botón de mostrar/ocultar contraseña automático.
 * - Estados de error y validación visual.
 */
const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  icon: Icon, 
  error, 
  helperText,
  required = false,
  disabled = false,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`w-full mb-4 ${className}`}>
      {/* --- Label --- */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5 ml-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative group">
        {/* --- Icono Izquierdo --- */}
        {Icon && (
          <div className={`
            absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors
            ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}
          `}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* --- Input --- */}
        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full py-2.5 rounded-lg border bg-white dark:bg-slate-900 transition-all duration-200
            placeholder:text-gray-400 dark:placeholder:text-slate-500
            focus:outline-none focus:ring-4 focus:ring-opacity-20
            disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-slate-800
            ${Icon ? 'pl-10' : 'pl-4'} 
            ${isPassword ? 'pr-10' : 'pr-4'}
            ${error 
              ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-400 dark:hover:border-slate-500'
            }
          `}
        />

        {/* --- Icono Derecho (Password Toggle o Error) --- */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
              tabIndex="-1" // Evita que se enfoque al tabular el formulario
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {/* Si hay error y NO es password (para no solapar iconos), mostramos alerta */}
          {error && !isPassword && (
            <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* --- Mensajes de Error o Ayuda --- */}
      {error ? (
        <p className="mt-1.5 ml-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1 animate-fadeIn">
          {/* Opcional: Icono pequeño en el texto de error */}
          {/* <AlertCircle className="w-3 h-3" /> */}
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 ml-1 text-xs text-gray-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default React.memo(InputField);