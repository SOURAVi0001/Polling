/**
 * EmptyPollPlaceholder for when no active poll is running.
 * Shows an instructional empty state with icon.
 */
import { BarChart2 } from 'lucide-react';

export function EmptyPollPlaceholder() {
      return (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 p-12 border-2 border-dashed border-gray-200 rounded-2xl">
                  <BarChart2 size={48} className="mb-4 opacity-50" />
                  <p className="text-gray-500 font-medium">No active poll</p>
                  <p className="text-gray-400 text-sm">Create a new poll to get started</p>
            </div>
      );
}
