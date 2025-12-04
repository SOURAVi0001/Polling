/**
 * Updated Button component to match the rounded, purple theme of the Figma design.
 */
import React from 'react';

export function Button({
      children,
      onClick,
      disabled = false,
      variant = 'primary', // primary, secondary, outline, danger
      size = 'md', // sm, md, lg
      className = ''
}) {
      const baseStyles = "inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-full";

      const sizeStyles = {
            sm: "px-4 py-2 text-sm",
            md: "px-8 py-3 text-base",
            lg: "px-10 py-4 text-lg"
      };

      const variantStyles = {
            primary: "bg-[#5B4EF0] text-white hover:bg-[#4839D3] shadow-lg hover:shadow-xl",
            secondary: "bg-white text-[#5B4EF0] border-2 border-[#5B4EF0] hover:bg-purple-50",
            danger: "bg-red-500 text-white hover:bg-red-600",
            outline: "bg-transparent border-2 border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800"
      };

      return (
            <button
                  onClick={onClick}
                  disabled={disabled}
                  className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            >
                  {children}
            </button>
      );
}