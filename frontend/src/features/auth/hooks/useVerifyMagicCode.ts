import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { type AuthResponse } from "../types/auth.types";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import i18n from "../../../i18n";
import api from "../../../shared/api/api";


export const useVerifyMagicCode = () => {
  const { setSubmitting, setError, setSuccess, email } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (code: string) => {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await api.post<AuthResponse>("auth/verify", {
        email,
        code,
      });
      return response.data;
    },
   onSuccess: (data: AuthResponse) => {
    setSuccess(data.message);
    setSubmitting(false);

    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      navigate("/dashboard");
    } else if (data.requires_completion && data.verification_id) {
      const { setVerificationToken } = useAuthStore.getState();
      setVerificationToken(data.verification_id);
      navigate("/complete-profile");
    }

    localStorage.setItem("email", email);
    console.log("Verified successfully:", data.account);
  },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message ||i18n.t("errors.invalid_code");
        setError(message);
      } else {
        setError(i18n.t("errors.unexpected"));
      }
      setSubmitting(false);
    },
  });
};

