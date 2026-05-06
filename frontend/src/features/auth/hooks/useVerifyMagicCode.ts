import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import type { AuthResponse } from "../types/auth.types";
import i18n from "../../../i18n";

export const useVerifyMagicCode = () => {
  const { setSubmitting, setError, setSuccess, email } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (code: string) => {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      return authApi.verifyMagicCode(email, code);
    },
    onSuccess: (data: AuthResponse) => {
      setSuccess(data.message);
      setSubmitting(false);

      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("email", email);
        navigate("/dashboard");
        return;
      }

      if (data.requires_completion && data.verification_id) {
        useAuthStore.getState().setVerificationToken(data.verification_id);
        localStorage.setItem("email", email);
        navigate("/complete-profile");
      }
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || i18n.t("errors.invalid_code"));
      } else {
        setError(i18n.t("errors.unexpected"));
      }

      setSubmitting(false);
    },
  });
};
