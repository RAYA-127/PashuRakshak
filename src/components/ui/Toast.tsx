import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useAppState } from '@/context/AppContext';

const config = {
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconColor: 'text-blue-500' },
  success: { icon: CheckCircle2, bg: 'bg-safe-50', border: 'border-safe-200', text: 'text-safe-800', iconColor: 'text-safe-500' },
  warning: { icon: AlertTriangle, bg: 'bg-warn-50', border: 'border-warn-200', text: 'text-warn-800', iconColor: 'text-warn-500' },
  error: { icon: XCircle, bg: 'bg-danger-50', border: 'border-danger-200', text: 'text-danger-800', iconColor: 'text-danger-500' },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useAppState();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((toast) => {
        const cfg = config[toast.type];
        const Icon = cfg.icon;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 rounded-xl border ${cfg.bg} ${cfg.border} p-4 shadow-lg animate-toast-in`}
          >
            <Icon className={`h-5 w-5 flex-shrink-0 ${cfg.iconColor}`} />
            <p className={`text-sm font-medium ${cfg.text} flex-1`}>{toast.message}</p>
            <button onClick={() => dismissToast(toast.id)} className={`${cfg.text} opacity-50 hover:opacity-100`}>
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
