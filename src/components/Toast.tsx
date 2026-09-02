import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto bg-black text-white px-4 py-3.5 shadow-2xl flex items-center justify-between gap-3 border border-neutral-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-neutral-400 shrink-0" />}
            <span className="text-sm font-medium tracking-wide">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-neutral-400 hover:text-white p-1 transition-colors"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
