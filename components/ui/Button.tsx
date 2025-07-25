
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        flex items-center justify-center
        bg-blue-600 text-white font-bold py-3 px-4 rounded-lg 
        hover:bg-blue-700 focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-opacity-50
        transition-colors duration-300
        disabled:bg-slate-400 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
