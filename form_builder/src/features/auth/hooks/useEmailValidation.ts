import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { type AuthResponse } from "../types/auth.types";
import i18n from "../../../i18n";
import api from "../../../shared/api/api";



export const useEmailValidation = () => {
  const { setSubmitting, setError, setSuccess, setView } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, action }: { email: string; action: "login" | "signup" | "verification" }) => {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        if (action === "login") {
          const response = await api.post<AuthResponse>("auth/login", { email });
          return response.data;
        } else if (action === "signup") {
          const response = await api.post<AuthResponse>("auth/register", { email });
          return response.data;
        } else {
          // Action is "verification" (Resend).
          const response = await api.post<AuthResponse>("auth/login", { email });
          return response.data;
        }
      } catch (error) {
        if (action === "verification" && axios.isAxiosError(error)) {
          if (error.response?.status === 422 || error.response?.status === 404) {
             const regResponse = await api.post<AuthResponse>("auth/register", { email });
             return regResponse.data;
          }
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      setSuccess(data.message);
      setSubmitting(false);
      // Switch to verification view after successful link/code send
      setView("verification");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || i18n.t("errors.generic");
        setError(message);
      } else {
        setError(i18n.t("errors.unexpected"));
      }
      setSubmitting(false);
    },
  });
};

