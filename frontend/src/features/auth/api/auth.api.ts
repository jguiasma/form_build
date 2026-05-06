import api from "../../../shared/api/api";
import type { AuthResponse } from "../types/auth.types";

export const authApi = {
  login: async (email: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("auth/login", { email });
    return response.data;
  },

  register: async (email: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("auth/register", { email });
    return response.data;
  },

  verifyMagicCode: async (email: string, code: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("auth/verify", { email, code });
    return response.data;
  },
};
