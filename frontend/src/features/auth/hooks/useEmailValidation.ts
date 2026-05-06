import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import type { AuthAction } from "../types/auth.types";
import i18n from "../../../i18n";

export const useEmailValidation = () => {
  const { setSubmitting, setError, setSuccess, setView } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, action }: { email: string; action: AuthAction }) => {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      try {
        if (action === "signup") {
          return await authApi.register(email);
        }

        return await authApi.login(email);
      } catch (error) {
        if (action === "verification" && axios.isAxiosError(error)) {
          if (error.response?.status === 422 || error.response?.status === 404) {
            return await authApi.register(email);
          }
        }

        throw error;
      }
    },
    onSuccess: (data) => {
      setSuccess(data.message);
      setSubmitting(false);
      setView("verification");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || i18n.t("errors.generic"));
      } else {
        setError(i18n.t("errors.unexpected"));
      }

      setSubmitting(false);
    },
  });
};
