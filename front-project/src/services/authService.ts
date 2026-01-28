import api from './api';

// Tipos básicos para a autenticação (poderão ser expandidos conforme necessário)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/sessions', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    // Lógica de logout (remover tokens, etc)
    localStorage.removeItem('@EcoRota:token');
  }
};
