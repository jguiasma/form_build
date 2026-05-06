import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FieldOption {
  id: number;
  field_id: number;
  label: string;
  value: string;
  option_order: number;
}

const EMPTY_OPTIONS: FieldOption[] = [];

export const useFieldOptions = (fieldId: string | number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['fieldOptions', fieldId],
    queryFn: async (): Promise<FieldOption[]> => {
      const { data } = await api.get(`/admin/fields/${fieldId}/options`);
      return data.data;
    },
    enabled: !!fieldId && !String(fieldId).startsWith('temp_'), // Only fetch for real IDs, not temp_ ones
  });

  const addMutation = useMutation({
    mutationFn: async (option: Partial<FieldOption>) => {
      const { data } = await api.post(`/admin/fields/${fieldId}/options`, option);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fieldOptions', fieldId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (option: Partial<FieldOption> & { id: number }) => {
      const { data } = await api.put(`/admin/fields/${fieldId}/options`, option);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fieldOptions', fieldId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (optionId: number) => {
      await api.delete(`/admin/fields/${fieldId}/options`, { data: { id: optionId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fieldOptions', fieldId] });
    }
  });

  const reorderBulkMutation = useMutation({
    mutationFn: async (order: number[]) => {
      await api.post(`/admin/fields/${fieldId}/options/reorder`, { order });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fieldOptions', fieldId] });
    }
  });

  return {
    options: query.data || EMPTY_OPTIONS,
    isLoading: query.isLoading,
    addOption: addMutation.mutateAsync,
    updateOption: updateMutation.mutateAsync,
    deleteOption: deleteMutation.mutateAsync,
    reorderBulk: reorderBulkMutation.mutateAsync,
    isMutating: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending || reorderBulkMutation.isPending
  };
};
