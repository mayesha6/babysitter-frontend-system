'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 active toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, title: string = 'Success', duration?: number) =>
      showToast(message, 'success', title, duration),
    error: (message: string, title: string = 'Error', duration?: number) =>
      showToast(message, 'error', title, duration),
    info: (message: string, title: string = 'Notice', duration?: number) =>
      showToast(message, 'info', title, duration),
    warning: (message: string, title: string = 'Warning', duration?: number) =>
      showToast(message, 'warning', title, duration),
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, toast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((item) => (
        <div key={item.id} className={`toast-card toast-${item.type}`}>
          <div className="toast-icon">
            {item.type === 'success' && <CheckCircle2 size={22} />}
            {item.type === 'error' && <AlertCircle size={22} />}
            {item.type === 'info' && <Info size={22} />}
            {item.type === 'warning' && <AlertTriangle size={22} />}
          </div>
          <div className="toast-body">
            {item.title && <div className="toast-title">{item.title}</div>}
            <div className="toast-message">{item.message}</div>
          </div>
          <button onClick={() => removeToast(item.id)} className="toast-close" title="Dismiss">
            <X size={16} />
          </button>
          <div className="toast-progress-bar" style={{ animationDuration: `${item.duration || 4000}ms` }} />
        </div>
      ))}
    </div>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
