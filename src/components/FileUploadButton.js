// src/components/FileUploadButton.js
import React, { useRef } from 'react';
import { FaFileUpload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // O tus iconos preferidos

const FileUploadButton = ({
  name,             // HTML name attribute for the input
  fileName,         // Name of the currently selected file (from parent state)
  onChangeFile,     // Function called when a file is selected (passed from parent)
  label,            // Text label shown above the button
  accept,           // Accepted file types (e.g., "image/*", ".cer")
  icon: Icon = FaFileUpload, // Icon component to display
  error,            // Error message string related to this input (from parent state)
  helpText,         // Optional help text below the button
  darkMode,         // Boolean for dark mode styling
  inputRef          // Ref object passed from parent to control the hidden input
}) => {
  // Use the passed ref directly
  const currentInputRef = inputRef;

  const handleClick = () => {
    if (currentInputRef && currentInputRef.current) {
      // Reset value to allow re-selecting the same file if needed
      currentInputRef.current.value = null;
      currentInputRef.current.click(); // Trigger file selection dialog
    } else {
      console.warn("FileUploadButton: inputRef no está correctamente asignada para", name);
    }
  };

  // Determine which status icon to show
  const getStatusIcon = () => {
    if (error) return <FaTimesCircle className="text-red-500 ml-2 flex-shrink-0" title={error} />;
    if (fileName) return <FaCheckCircle className="text-green-500 ml-2 flex-shrink-0" title="Archivo seleccionado" />;
    return null;
  };

  // Generate a unique ID for label association for accessibility
  const inputId = `file-upload-${name}-${React.useId()}`;

  return (
    <div className="mb-4 w-full">
      {/* Label for the input */}
      <label htmlFor={inputId} className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label} {/** Display the label passed as prop */}
      </label>
      {/* Hidden actual file input */}
      <input
        type="file"
        name={name}
        accept={accept}
        ref={currentInputRef} // Assign the ref here
        onChange={onChangeFile}
        className="hidden"
        id={inputId}
        aria-labelledby={`label-for-${inputId}`}
        aria-invalid={!!error}
        aria-describedby={error ? `error-for-${inputId}` : helpText ? `help-for-${inputId}` : undefined}
      />
      {/* The visible button that triggers the hidden input */}
      <button
        type="button"
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between px-4 py-2 border rounded-md shadow-sm
          text-sm font-medium transition-colors text-left
          ${darkMode
            ? 'bg-gray-600 border-gray-500 text-gray-200 hover:bg-gray-500'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${darkMode ? 'focus:ring-offset-gray-800 focus:ring-blue-500' : 'focus:ring-offset-gray-50 focus:ring-blue-500'}
          ${error ? 'border-red-500' : ''}
        `}
        id={`label-for-${inputId}`}
      >
        <div className="flex items-center truncate mr-2"> {/* Added mr-2 */}
            <Icon aria-hidden="true" className={`mr-2 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            {fileName ? (
                <span className="truncate">{fileName}</span>
            ) : (
                // Show a generic prompt if no file selected
                `Seleccionar ${label.toLowerCase().includes('logo') ? 'logo' : 'archivo'}`
            )}
        </div>
        {getStatusIcon()}
      </button>
      {/* Help text and Error message */}
      {helpText && !error && <p id={`help-for-${inputId}`} className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{helpText}</p>}
      {error && <p id={`error-for-${inputId}`} className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileUploadButton;