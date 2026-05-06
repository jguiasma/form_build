export type AuthView = "signup" | "login" | "verification";
export type AuthAction = "login" | "signup" | "verification";

export interface AuthResponse {
  success: boolean;
  message: string;
  account?: Account;
  email?: string;
  token?: string;
  requires_completion?: boolean;
  verification_id?: string;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  role_id: number;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  view: AuthView;
  email: string;
  verificationToken: string | null;
  isSubmitting: boolean;
  error: string | null;
  successMessage: string | null;
  setView: (view: AuthView) => void;
  setEmail: (email: string) => void;
  setVerificationToken: (token: string | null) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (message: string | null) => void;
  
  clearAlerts: () => void;
}

