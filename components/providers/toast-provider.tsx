'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { Toaster, toast } from 'sonner';

type ToastTone = 'success' | 'error' | 'info';

interface ToastInput {
  title: string;
  message?: string;
  tone?: ToastTone;
}

interface ToastContextValue {
  pushToast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const pushToast = useCallback(({ title, message, tone = 'info' }: ToastInput) => {
    if (tone === 'success') {
      toast.success(title, { description: message });
    } else if (tone === 'error') {
      toast.error(title, { description: message });
    } else {
      toast(title, { description: message });
    }
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
