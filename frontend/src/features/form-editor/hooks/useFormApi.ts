import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { FormSchema, FormType } from '../types/form-builder.types';
import { formApi } from "../api/form.api";
// We'll use the existing axios config if there's one, or just create a basic client
// Assuming there is auth token handling globally.
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Adding interceptor to grab bearer token from localStorage if it exists
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('biometric_auth_token') ||
                localStorage.getItem('token') || 
                sessionStorage.getItem('token') || 
                localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const useGetFieldTypes = () => {
  return useQuery({
    queryKey: ['formTypes'],
    queryFn: async (): Promise<FormType[]> => {
      const { data } = await api.get('/admin/form-types');
      return data.data.data; // Assuming it's paginated
    }
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
    mutationFn: async (formData: { title: string; description?: string; form_type_id?: number | string; require_biometrics?: boolean }) => {
      const { data } = await api.post('/admin/forms', formData);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

export const useUpdateFormSchema = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (schema: FormSchema) => {
      const { data } = await api.put(`/admin/forms/${id}`, schema);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', id] });
    }
  });
};

export const useUpdateStep = (formId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string | number; title?: string; description?: string }) => {
      const response = await api.put(`/admin/steps/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', formId] });
    }
  });
};

export const useDeleteStep = (formId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete(`/admin/steps/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', formId] });
    }
  });
};

export const usePublishForm = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/admin/forms/${id}/publish`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form', id] });
    }
  });
};

export const useGetPublicForm = (uuid: string) => {
  return useQuery({
    queryKey: ['public-form', uuid],
    queryFn: async (): Promise<FormSchema> => {
      const { data } = await api.get(`/forms/public/${uuid}`);
      return data.data;
    },
    enabled: !!uuid
  });
};

export const useSubmitFormResponse = (formId: number | string) => {
  return useMutation({
    mutationFn: async (payload: { response_id: number; answers: any }) => {
      // In a real app, we might need to save answers step by step
      // For now, let's assume we have a start endpoint and a submit endpoint
      const { data } = await api.post(`/forms/${formId}/submit`, payload);
      return data;
    }
  });
};

export const useStartForm = (formId: number | string) => {
  return useMutation({
    mutationFn: async (biometricData: any = {}) => {
      const { data } = await api.post(`/forms/${formId}/start`, biometricData);
      return data;
    }
  });
};

export const useSaveAnswers = (formId: number | string, stepId: number | string) => {
  return useMutation({
    mutationFn: async ({ response_id, answers }: { response_id: number; answers: any[] }) => {
       const { data } = await api.post(`/forms/${formId}/steps/${stepId}/answers`, { 
         response_id,
         answers 
       });
       return data;
    }
  });
};

export const useGetForms = (params: { search?: string; status?: string; form_type_id?: string | number; page?: number } = {}) => {
  return useQuery({
    queryKey: ['forms', params],
    queryFn: async (): Promise<{ data: any[], total: number, current_page: number, last_page: number }> => {
      const { data } = await api.get('/admin/forms', {
        params
      });
      // data.data is the Laravel Paginator object
      return {
        data: data.data.data,
        total: data.data.total,
        current_page: data.data.current_page,
        last_page: data.data.last_page
      };
    }
  });
};

export const useGetFormResponses = (formId: number | string) => {
  return useQuery({
    queryKey: ['responses', formId],
    queryFn: async (): Promise<any[]> => {
      const { data } = await api.get(`/admin/forms/${formId}/responses`);
      return data.data;
    },
    enabled: !!formId
  });
};

export const useDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await api.delete(`/admin/forms/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

export const useArchiveForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { data } = await api.put(`/admin/forms/${id}`, { status: 'archived' });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    }
  });
};

export const useGetGlobalStats = () => {
  return useQuery({
    queryKey: ['global-stats'],
    queryFn: async (): Promise<any> => {
      const { data } = await api.get('/admin/stats');
      return data.data;
    }
  });
};
