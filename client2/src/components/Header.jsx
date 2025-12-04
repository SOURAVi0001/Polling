/**
 * Header component for teacher/student dashboard tops.
 * Shows role title, student count, and action buttons.
 */
import { Users, LogOut } from 'lucide-react';
import { Button } from './Button';

export function Header({ title, subtitle = '', studentCount = 0, onLogout }) {
      return (
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                  <div>
                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                        {studentCount > -1 && (
                              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2">
                                    <Users size={18} className="text-green-600" />
                                    <span className="font-bold text-gray-900">{studentCount}</span>
                                    <span className="text-gray-600 text-sm">Students</span>
                              </div>
                        )}
                        <Button variant="secondary" size="sm" onClick={onLogout}>
                              <LogOut size={18} /> Exit
                        </Button>
                  </div>
            </header>
      );
}
