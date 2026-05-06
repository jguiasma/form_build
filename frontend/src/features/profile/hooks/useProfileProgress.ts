import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../api/profile.api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";

export const useProfileProgress = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { email, verificationToken } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone_number: "",
    avatar: "",
    photo: null as File | null,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const completeRegistrationMutation = useMutation({
    mutationFn: async () => {
      const data = new FormData();
      data.append("email", email);
      data.append("verification_token", verificationToken || "");
      data.append("name", formData.name);
      data.append("specialty", formData.specialty);
      data.append("phone_number", formData.phone_number);
      
      if (formData.photo) {
        data.append("photo", formData.photo);
      } else if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      return profileApi.finalizeRegistration(data);
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["profileProgress"] });
      navigate("/dashboard");
    },
  });

  return {
    step,
    setStep,
    formData,
    setFormData,
    nextStep,
    prevStep,
    completeRegistrationMutation,
  };
};

