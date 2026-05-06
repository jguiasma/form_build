import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fieldOptionsApi } from '../api/form.api';
import type { FieldOption } from '../types/form-builder.types';

export type { FieldOption } from '../types/form-builder.types';

const EMPTY_OPTIONS: FieldOption[] = [];

export const useFieldOptions = (fieldId: string | number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['fieldOptions', fieldId],
    queryFn: () => fieldOptionsApi.getFieldOptions(fieldId),
    enabled: !!fieldId && !String(fieldId).startsWith('temp_'), // Only fetch for real IDs, not temp_ ones
  });

  const addMutation = useMutation({
    mutationFn: (option: Partial<FieldOption>) => fieldOptionsApi.addFieldOption(fieldId, option),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fieldOptions', fieldId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (option: Partial<FieldOption> & { id: string | number }) =>
      fieldOptionsApi.updateFieldOption(fieldId, option),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fieldOptions', fieldId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (optionId: string | number) => fieldOptionsApi.deleteFieldOption(fieldId, optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fieldOptions', fieldId] });
    }
  });

  const reorderBulkMutation = useMutation({
    mutationFn: (order: Array<string | number>) => fieldOptionsApi.reorderFieldOptions(fieldId, order),
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
