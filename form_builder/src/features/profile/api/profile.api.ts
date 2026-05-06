import api from "../../../shared/api/api";
import type { ProfileProgress, ProfileStepResponse } from "../types/profile.types";

export const profileApi = {
  getProgress: async (): Promise<ProfileProgress> => {
    const response = await api.get<ProfileProgress>("profile/progress");
    return response.data;
  },

  updateName: async (name: string): Promise<ProfileStepResponse> => {
    const response = await api.post<ProfileStepResponse>("profile/update-name", { name });
    return response.data;
  },

  updateSpecialty: async (specialty: string): Promise<ProfileStepResponse> => {
    const response = await api.post<ProfileStepResponse>("profile/update-specialty", { specialty });
    return response.data;
  },

  updatePhone: async (phone_number: string): Promise<ProfileStepResponse> => {
    const response = await api.post<ProfileStepResponse>("profile/update-phone", { phone_number });
    return response.data;
  },

  updateAvatar: async (avatar: string): Promise<ProfileStepResponse> => {
    const response = await api.post<ProfileStepResponse>("profile/update-avatar", { avatar });
    return response.data;
  },

  finalizeRegistration: async (formData: FormData): Promise<any> => {
    const response = await api.post("auth/finalize-registration", formData);
    return response.data;
  },
};


