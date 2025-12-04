/**
 * Updated Input component with a cleaner, minimal look.
 */
import React from 'react';

export function Input({
      label,
      value,
      onChange,
      placeholder,
      type = 'text',
      className = '',
      maxLength
}) {
      return (
            <div className="flex flex-col gap-2 w-full">
                  {label && (
                        <label className="text-lg font-bold text-gray-900">{label}</label>
                  )}
                  <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        className={`w-full px-5 py-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#5B4EF0] focus:bg-white outline-none transition-all text-gray-800 placeholder-gray-400 font-medium ${className}`}
                  />
            </div>
      );
}