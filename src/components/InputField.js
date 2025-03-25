import React from 'react';
import { useThemeContext } from '../context/ThemeContext';

const InputField = React.memo(({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  icon: Icon = null, 
  required = false 
}) => {
  const { darkMode } = useThemeContext();
  
  return (
    <div className="relative mb-4">
      {label && <label className="block mb-1 font-medium">{label}</label>}
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon size={20} />
        </div>
      )}
      <input
        type={type}
        name={name}
        className={`
          w-full p-3 ${Icon ? 'pl-10' : 'pl-3'} rounded-lg border-2 transition-all duration-300
          focus:outline-none focus:ring-2
          ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-600'
              : 'bg-white text-black border-gray-300 focus:border-blue-400 focus:ring-blue-400'
          }
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
});

export default InputField;