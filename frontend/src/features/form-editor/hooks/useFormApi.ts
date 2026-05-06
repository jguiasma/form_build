import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FormSchema } from '../types/form-builder.types';
import { formApi, type CreateFormPayload, type FormsQueryParams } from "../api/form.api";

export const useGetFieldTypes = () => {
  return useQuery({
    queryKey: ['formTypes'],
    queryFn: formApi.getFieldTypes,
  });
};

export const useGetForm = (id: string | number) => {
  return useQuery({
    queryKey: ["form", id],
    queryFn: () => formApi.getForm(id),
    enabled: !!id,
  });
};

export const useCreateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: CreateFormPayload) => formApi.createForm(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

export const useUpdateFormSchema = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schema: FormSchema) => formApi.updateFormSchema(id, schema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', id] });
    }
  });
};

export const useUpdateStep = (formId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string | number; title?: string; description?: string }) =>
      formApi.updateStep(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', formId] });
    }
  });
};

export const useDeleteStep = (formId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: formApi.deleteStep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', formId] });
    }
  });
};

export const usePublishForm = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => formApi.publishForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', id] });
    }
  });
};

export const useGetForms = (params: FormsQueryParams = {}) => {
  return useQuery({
    queryKey: ['forms', params],
    queryFn: () => formApi.getForms(params),
  });
};

export const useGetFormResponses = (formId: number | string) => {
  return useQuery({
    queryKey: ['responses', formId],
    queryFn: () => formApi.getFormResponses(formId),
    enabled: !!formId
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: formApi.deleteForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

export const useArchiveForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: formApi.archiveForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

export const useGetGlobalStats = () => {
  return useQuery({
    queryKey: ['global-stats'],
    queryFn: formApi.getGlobalStats,
  });
};
