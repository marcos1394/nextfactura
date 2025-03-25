import React from 'react';

const ColorPicker = ({ label, name, value, onChange }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">{label}</label>
    <div className="flex items-center">
      <input
        type="color"
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="mr-4 w-10 h-10 p-0 border-none cursor-pointer"
      />
      <span>{value}</span>
    </div>
  </div>
);

export default React.memo(ColorPicker);