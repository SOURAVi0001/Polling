import React from 'react';

export function Card({ children, className = '', onClick, selected = false }) {
      return (
            <div 
                  onClick={onClick}
                  className={`bg-white rounded-3xl p-8 transition-all duration-200
                  ${selected 
                        ? 'border-2 border-[#5B4EF0] shadow-md' 
                        : 'border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'} 
                  ${className}`}
            >
                  {children}
            </div>
      );
}