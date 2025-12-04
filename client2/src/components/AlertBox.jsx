/**
 * AlertBox component for displaying warnings and info messages.
 */
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export function AlertBox({ type = 'warning', title, message, icon: Icon = null }) {
      const styles = {
            warning: 'bg-amber-50 border border-amber-200 text-amber-800',
            error: 'bg-red-50 border border-red-200 text-red-800',
            success: 'bg-green-50 border border-green-200 text-green-800',
            info: 'bg-blue-50 border border-blue-200 text-blue-800'
      };

      const defaultIcons = {
            warning: AlertCircle,
            error: AlertCircle,
            success: CheckCircle,
            info: Info
      };

      const IconComponent = Icon || defaultIcons[type];

      return (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${styles[type]}`}>
                  <IconComponent className="shrink-0 mt-0.5" size={18} />
                  <div className="flex flex-col gap-1">
                        {title && <p className="font-bold text-sm">{title}</p>}
                        {message && <p className="text-sm">{message}</p>}
                  </div>
            </div>
      );
}
