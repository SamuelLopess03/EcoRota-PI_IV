import api from './api';

// Tipos básicos para a autenticação (poderão ser expandidos conforme necessário)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  administrator: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('@EcoRota:token', response.data.token);
      localStorage.setItem('@EcoRota:administrator', JSON.stringify(response.data.administrator));
    }
    
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('@EcoRota:token');
    localStorage.removeItem('@EcoRota:administrator');
  },

  async register(data: { name: string; email: string; password: string }): Promise<void> {
    await api.post('/administrators', data);
  },

  async list(): Promise<AuthResponse['administrator'][]> {
      const response = await api.get<AuthResponse['administrator'][]>('/administrators');
      return response.data;
  }
};
