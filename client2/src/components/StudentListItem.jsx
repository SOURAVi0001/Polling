/**
 * StudentListItem for the Participants Modal.
 * Matches Screenshot 2025-12-03 at 9.39.03 AM.png
 */
import React from 'react';

export function StudentListItem({ name, onKick }) {
      return (
            <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 px-2 rounded-md transition-colors">
                  <span className="font-bold text-gray-900 text-sm">
                        {name}
                  </span>
                  {onKick && (
                        <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</span>
                              <button
                                    onClick={onKick}
                                    className="text-[#2563EB] hover:text-[#1d4ed8] text-sm font-semibold underline decoration-1 underline-offset-2"
                              >
                                    Kick out
                              </button>
                        </div>
                  )}
            </div>
      );
}