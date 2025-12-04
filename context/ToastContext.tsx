import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from './ThemeContext';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

const TOAST_DURATION = 4000;

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = { id, message, type };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      removeToast(id);
    }, TOAST_DURATION);
  }, [removeToast]);

  const success = useCallback((message: string) => showToast(message, 'success'), [showToast]);
  const error = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const info = useCallback((message: string) => showToast(message, 'info'), [showToast]);
  const warning = useCallback((message: string) => showToast(message, 'warning'), [showToast]);

  const value: ToastContextValue = {
    showToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  const { isDarkMode } = useTheme();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      {toasts.map(toast => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={onRemove} 
          isDarkMode={isDarkMode} 
        />
      ))}
    </div>
  );
};

// Individual Toast Component
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  isDarkMode: boolean;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, isDarkMode }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-400" />;
      default:
        return <Info size={20} className="text-blue-400" />;
    }
  };

  const getStyles = () => {
    if (isDarkMode) {
      const baseStyles = 'bg-gray-900/90 backdrop-blur-xl border text-white';
      switch (toast.type) {
        case 'success':
          return `${baseStyles} border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]`;
        case 'error':
          return `${baseStyles} border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]`;
        case 'warning':
          return `${baseStyles} border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]`;
        default:
          return `${baseStyles} border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)]`;
      }
    } else {
      const baseStyles = 'border-2 border-black text-black';
      switch (toast.type) {
        case 'success':
          return `${baseStyles} bg-green-100 shadow-[4px_4px_0px_0px_#22c55e]`;
        case 'error':
          return `${baseStyles} bg-red-100 shadow-[4px_4px_0px_0px_#ef4444]`;
        case 'warning':
          return `${baseStyles} bg-yellow-100 shadow-[4px_4px_0px_0px_#eab308]`;
        default:
          return `${baseStyles} bg-blue-100 shadow-[4px_4px_0px_0px_#3b82f6]`;
      }
    }
  };

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg animate-in slide-in-from-right duration-300 ${getStyles()}`}
    >
      {getIcon()}
      <span className="font-bold text-sm flex-1 uppercase">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className={`p-1 transition-colors rounded ${
          isDarkMode 
            ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
            : 'hover:bg-black/10'
        }`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
