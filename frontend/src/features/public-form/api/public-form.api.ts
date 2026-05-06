import api from "../../../shared/api/api";
import type {
  PublicFormSchema,
  SaveAnswersPayload,
  StartFormResponse,
  SubmitFormPayload,
} from "../types/public-form.types";

export const publicFormApi = {
  getPublicForm: async (uuid: string): Promise<PublicFormSchema> => {
    const { data } = await api.get(`/forms/public/${uuid}`);
    return data.data;
  },

  startForm: async (formId: number | string): Promise<StartFormResponse> => {
    const { data } = await api.post(`/forms/${formId}/start`);
    return data;
  },

  saveAnswers: async (
    formId: number | string,
    stepId: number | string,
    payload: SaveAnswersPayload
  ) => {
    const { data } = await api.post(`/forms/${formId}/steps/${stepId}/answers`, payload);
    return data;
  },

  submitFormResponse: async (formId: number | string, payload: SubmitFormPayload) => {
    const { data } = await api.post(`/forms/${formId}/submit`, payload);
    return data;
  },
};
