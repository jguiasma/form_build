import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AuthState, type AuthView } from "../types/auth.types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      view: "signup",
      email: "",
      verificationToken: null,
      isSubmitting: false,
      error: null,
      successMessage: null,
      setView: (view: AuthView) => set({ view }),
      setEmail: (email) => set({ email }),
      setVerificationToken: (verificationToken) => set({ verificationToken }),
      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      setError: (error) => set({ error }),
      setSuccess: (message) => set({ successMessage: message }),
      clearAlerts: () => set({ error: null, successMessage: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
// export const useAuthStore = create<AuthState>((set) => ({
//   view: "signup",
//   email: "",
//   isSubmitting: false,
//   error: null,
//   successMessage: null,
//   setView: (view: AuthView) => set({ view }),
//   setEmail: (email) => set({ email }),
//   setSubmitting: (isSubmitting) => set({ isSubmitting }),
//   setError: (error) => set({ error }),
//   setSuccess: (message) => set({ successMessage: message }),
//   resetForm: () =>
//     set({ email: "", error: null, successMessage: null, isSubmitting: false }),
// }));
