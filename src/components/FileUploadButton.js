import React from 'react';

const FileUploadButton = ({
  name,
  fileName,
  onClickHandlerRef,
  onChangeFile,
  icon: Icon,
  label,
  darkMode
}) => (
  <div className="mb-4">
    {label && <label className="block mb-2 font-medium">{label}:</label>}
    <div className="flex items-center">
      <input
        type="file"
        name={name}
        className="hidden"
        ref={onClickHandlerRef}
        onChange={onChangeFile}
      />
      <button
        type="button"
        onClick={() => onClickHandlerRef.current.click()}
        className={`
          w-full bg-gradient-to-r from-blue-500 to-blue-600 
          text-white px-4 py-3 rounded-lg 
          hover:from-blue-600 hover:to-blue-700 
          transition-all duration-300 
          flex items-center justify-center
          shadow-md hover:shadow-lg
        `}
      >
        <Icon className="mr-2" />
        {fileName || `Subir ${label}`}
      </button>
    </div>
  </div>
);

export default React.memo(FileUploadButton);