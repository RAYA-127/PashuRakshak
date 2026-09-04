import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type Role = 'farmer' | 'vet' | 'worker';
export type Connectivity = 'online' | 'offline';

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  connectivity: Connectivity;
  toggleConnectivity: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('vet');
  const [connectivity, setConnectivity] = useState<Connectivity>('online');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleConnectivity = useCallback(() => {
    setConnectivity((prev) => (prev === 'online' ? 'offline' : 'online'));
  }, []);

  return (
    <AppStateContext.Provider value={{ role, setRole, connectivity, toggleConnectivity, toasts, showToast, dismissToast }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
