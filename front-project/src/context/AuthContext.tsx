import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { LoginRequest } from '../services/authService';

interface Administrator {
  id: string;
  email: string;
  name: string;
}

interface AuthContextData {
  administrator: Administrator | null;
  signed: boolean;
  loading: boolean;
  signIn(credentials: LoginRequest): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [administrator, setAdministrator] = useState<Administrator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageAdministrator = localStorage.getItem('@EcoRota:administrator');
      const storageToken = localStorage.getItem('@EcoRota:token');

      if (storageAdministrator && storageToken) {
        setAdministrator(JSON.parse(storageAdministrator));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(credentials: LoginRequest) {
    const response = await authService.login(credentials);
    setAdministrator(response.administrator);
  }

  function signOut() {
    authService.logout();
    setAdministrator(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!administrator, administrator, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
