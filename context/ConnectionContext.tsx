import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { connectionApi, ConnectionRequest } from '../services/api';

interface ConnectionState {
  connectionId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  vmIp: string | null;
  error: string | null;
}

interface ConnectionContextValue extends ConnectionState {
  connect: (vmIp: string, password: string, useHttps?: boolean) => Promise<boolean>;
  disconnect: () => void;
}

const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined);

interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  const [state, setState] = useState<ConnectionState>({
    connectionId: null,
    isConnected: false,
    isConnecting: false,
    vmIp: null,
    error: null,
  });

  const connect = useCallback(async (vmIp: string, password: string, useHttps: boolean = true): Promise<boolean> => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      const request: ConnectionRequest = {
        vm_ip: vmIp,
        admin_password: password,
        use_https: useHttps,
      };
      
      const response = await connectionApi.connect(request);
      
      setState({
        connectionId: response.connection_id,
        isConnected: true,
        isConnecting: false,
        vmIp: vmIp,
        error: null,
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      connectionId: null,
      isConnected: false,
      isConnecting: false,
      vmIp: null,
      error: null,
    });
  }, []);

  const value: ConnectionContextValue = {
    ...state,
    connect,
    disconnect,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = (): ConnectionContextValue => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};
