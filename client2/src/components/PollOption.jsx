/**
 * PollOption component matching the purple progress bar design.
 */
import React from 'react';

export function PollOption({
      text,
      votes = 0,
      percentage = 0,
      isSelected = false,
      showVotes = true,
      onClick,
      index
}) {
      return (
            <div
                  onClick={onClick}
                  className={`relative w-full overflow-hidden rounded-lg transition-all cursor-pointer group
                        ${isSelected ? 'ring-2 ring-[#5B4EF0]' : 'hover:bg-gray-50'}
                  `}
            >
                  {/* Background Bar Container */}
                  <div className="flex items-center w-full bg-gray-50 h-14 rounded-lg relative border border-gray-100">
                        
                        {/* Progress Fill */}
                        <div 
                              className="absolute left-0 top-0 bottom-0 h-full bg-[#5B4EF0] opacity-80 rounded-lg transition-all duration-700 ease-out"
                              style={{ width: `${percentage}%` }}
                        />

                        {/* Content Layer (z-10 to sit above progress) */}
                        <div className="relative z-10 flex items-center justify-between w-full px-4">
                              <div className="flex items-center gap-3">
                                    <div className={`
                                          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                          ${percentage > 0 ? 'bg-white text-[#5B4EF0]' : 'bg-[#5B4EF0] text-white'}
                                    `}>
                                          {index + 1}
                                    </div>
                                    <span className={`font-semibold text-lg ${percentage > 50 ? 'text-white' : 'text-gray-800'}`}>
                                          {text}
                                    </span>
                              </div>
                              
                              {showVotes && (
                                    <span className={`font-bold text-lg ${percentage > 90 ? 'text-white' : 'text-gray-900'}`}>
                                          {percentage}%
                                    </span>
                              )}
                        </div>
                  </div>
            </div>
      );
}