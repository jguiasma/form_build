import { useMutation, useQuery } from "@tanstack/react-query";
import { publicFormApi } from "../api/public-form.api";
import type { SaveAnswersPayload, SubmitFormPayload } from "../types/public-form.types";

export const useGetPublicForm = (uuid: string) => {
  return useQuery({
    queryKey: ["public-form", uuid],
    queryFn: () => publicFormApi.getPublicForm(uuid),
    enabled: !!uuid,
  });
};

export const useStartForm = (formId: number | string) => {
  return useMutation({
    mutationFn: () => publicFormApi.startForm(formId),
  });
};

export const useSaveAnswers = (formId: number | string, stepId: number | string) => {
  return useMutation({
    mutationFn: (payload: SaveAnswersPayload) =>
      publicFormApi.saveAnswers(formId, stepId, payload),
  });
};

export const useSubmitFormResponse = (formId: number | string) => {
  return useMutation({
    mutationFn: (payload: SubmitFormPayload) => publicFormApi.submitFormResponse(formId, payload),
  });
};
