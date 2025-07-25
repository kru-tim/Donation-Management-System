
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  const readOnlyClasses = props.readOnly 
    ? 'bg-slate-200 cursor-not-allowed focus:ring-0' 
    : 'bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>}
      <input
        id={id}
        className={`
          w-full px-4 py-2.5 
          border border-slate-300 
          text-slate-900 placeholder-slate-400 
          rounded-lg shadow-sm 
          focus:outline-none
          transition-colors duration-200 ease-in-out
          ${readOnlyClasses}
        `}
        {...props}
      />
    </div>
  );
};
