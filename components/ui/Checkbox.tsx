
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, id, ...props }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        className="h-5 w-5 bg-slate-100 border-slate-300 rounded text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        {...props}
      />
      <label htmlFor={id} className="ml-3 block text-sm text-slate-700">
        {label}
      </label>
    </div>
  );
};
