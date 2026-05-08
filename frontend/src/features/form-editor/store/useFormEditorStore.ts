import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FormSchema, FormStep, FormField } from '../types/form-builder.types';
import * as _ from 'lodash';

interface FormEditorState {
  schema: FormSchema;
  activeStepId: string | number | null;
  selectedFieldId: string | number | null;
  isSaving: boolean;
  setSchema: (schema: FormSchema) => void;
  syncWithServer: (serverSchema: FormSchema) => void;
  updateFormDetails: (title: string, description: string) => void;
  addStep: () => void;
  removeStep: (stepId: string | number) => void;
  reorderSteps: (startIndex: number, endIndex: number) => void;
  setActiveStep: (stepId: string | number | null) => void;
  updateStep: (stepId: string | number, updates: Partial<FormStep>) => void;
  addField: (stepId: string | number, type: string, dropMode?: 'NEW_ROW' | 'SAME_ROW', targetFieldId?: string | number | null, position?: 'top' | 'bottom' | 'left' | 'right', fieldTemplate?: Partial<FormField>) => void;
  removeField: (fieldId: string | number) => void;
  updateField: (fieldId: string | number, updates: Partial<FormField>) => void;
  setSelectedField: (fieldId: string | number | null) => void;
  moveField: (fieldId: string | number, overId: string | number, position: 'top' | 'bottom' | 'left' | 'right') => void;
}

const generateId = () => `temp_${Math.random().toString(36).substring(2, 9)}`;

const getDefaultValidationRules = (type: string) => {
  if (type === 'slider') {
    return { slider_config: { min: 0, max: 100, step: 1 } };
  }

  if (type === 'matrix') {
    return { matrix_config: { rows: ['Row 1', 'Row 2'], columns: ['Option 1', 'Option 2', 'Option 3'] } };
  }

  if (type === 'conditional') {
    return { conditional_config: { condition_label: 'Conditional block', action_label: 'Shown when condition matches' } };
  }

  return undefined;
};

export const useFormEditorStore = create<FormEditorState>()(
  persist(
    (set, get) => ({
      schema: {
        title: 'Untitled Form',
        steps: []
      },
      activeStepId: null,
      selectedFieldId: null,
      isSaving: false,

      setSchema: (schema) => {
        const safeSchema = { ...schema, steps: schema.steps || [] };
        const activeStepId = safeSchema.steps.length > 0 ? safeSchema.steps[0].id! : null;
        set({ schema: safeSchema, activeStepId });
      },

      syncWithServer: (serverSchema) => {
        const state = get();
        const safeSchema = { ...serverSchema, steps: serverSchema.steps || [] };
        
        let newSelectedId = state.selectedFieldId;
        
        // If we have a selected field with a temp ID, find its counterpart in the new schema
        if (state.selectedFieldId && String(state.selectedFieldId).startsWith('temp_')) {
          const allFields = safeSchema.steps.flatMap(s => s.fields);
          // We can't use ID, but we can use label/type/etc. or ideally a unique key if we had one.
          // In addField, we set field_key to `${type}_${Date.now()}`. That's our anchor!
          const tempField = state.schema.steps.flatMap(s => s.fields).find(f => f.id === state.selectedFieldId);
          if (tempField) {
             const match = allFields.find(f => f.field_key === tempField.field_key);
             if (match) newSelectedId = match.id!;
          }
        }
        
        set({ schema: safeSchema, selectedFieldId: newSelectedId });
      },

      updateFormDetails: (title, description) => set((state) => ({
        schema: { ...state.schema, title, description }
      })),

      addStep: () => set((state) => {
        const newStep: FormStep = {
          id: generateId(),
          title: `Step ${state.schema.steps.length + 1}`,
          step_order: state.schema.steps.length + 1,
          fields: []
        };
        return {
          schema: {
            ...state.schema,
            steps: [...state.schema.steps, newStep]
          },
          activeStepId: newStep.id
        };
      }),

      removeStep: (stepId) => set((state) => {
        const newSteps = state.schema.steps.filter(s => s.id !== stepId)
          .map((s, idx) => ({ ...s, step_order: idx + 1 }));
        
        return {
          schema: { ...state.schema, steps: newSteps },
          activeStepId: newSteps.length > 0 ? newSteps[0].id! : null,
          selectedFieldId: null
        };
      }),

      reorderSteps: (startIndex, endIndex) => set((state) => {
        const steps = [...state.schema.steps];
        const [removed] = steps.splice(startIndex, 1);
        steps.splice(endIndex, 0, removed);
        
        return {
          schema: {
            ...state.schema,
            steps: steps.map((s, idx) => ({ ...s, step_order: idx + 1 }))
          }
        };
      }),

      setActiveStep: (stepId) => set({ activeStepId: stepId, selectedFieldId: null }),

      updateStep: (stepId, updates) => set((state) => ({
        schema: {
          ...state.schema,
          steps: state.schema.steps.map(s => s.id === stepId ? { ...s, ...updates } : s)
        }
      })),

      addField: (stepId,
         type,
          dropMode = 'NEW_ROW',
           targetFieldId = null, 
           position = 'bottom',
           fieldTemplate = {}) =>
             set((state) => {
        const stepIndex = state.schema.steps.findIndex(s => s.id === stepId);
        if (stepIndex === -1) return state;

        const step = state.schema.steps[stepIndex];
        let newFieldOrder = 1;
        let newColumnIndex = 1;
        let fields = [...step.fields];

        if (step.fields.length > 0) {
          if (dropMode === 'NEW_ROW') {
            if (targetFieldId) {
              const targetField = step.fields.find(f => f.id === targetFieldId);
              if (targetField) {
                newFieldOrder = position === 'top' ? targetField.field_order : targetField.field_order + 1;
                // Shift all fields after or at this order
                fields = fields.map(f => f.field_order >= newFieldOrder ? { ...f, field_order: f.field_order + 1 } : f);
              }
            } else {
              newFieldOrder = Math.max(...step.fields.map(f => f.field_order)) + 1;
            }
          } else if (dropMode === 'SAME_ROW' && targetFieldId) {
            const targetField = step.fields.find(f => f.id === targetFieldId);
            if (targetField) {
              newFieldOrder = targetField.field_order;
              const targetColumnIndex = targetField.column_index || 1;
              newColumnIndex = position === 'left' ? targetColumnIndex : targetColumnIndex + 1;
              // Shift columns in the same row
              fields = fields.map(f => (f.field_order === newFieldOrder && (f.column_index || 1) >= newColumnIndex) 
                ? { ...f, column_index: (f.column_index || 1) + 1 } 
                : f
              );
            }
          }
        }

        const newField: FormField = {
          id: generateId(),
          label: fieldTemplate.label || `New ${_.startCase(type)}`,
          field_key: fieldTemplate.field_key || `${type}_${Date.now()}`,
          type,
          placeholder: fieldTemplate.placeholder,
          default_value: fieldTemplate.default_value,
          description: fieldTemplate.description,
          custom_error_message: fieldTemplate.custom_error_message,
          is_required: fieldTemplate.is_required ?? false,
          validation_rules: fieldTemplate.validation_rules || getDefaultValidationRules(type),
          field_order: newFieldOrder,
          column_index: newColumnIndex,
          column_span: fieldTemplate.column_span || 1,
          options: fieldTemplate.options,
        };

        const newSteps = [...state.schema.steps];
        newSteps[stepIndex] = {
          ...step,
          fields: [...fields, newField]
        };

        return {
          schema: { ...state.schema, steps: newSteps },
          selectedFieldId: newField.id
        };
      }),

      removeField: (fieldId) => set((state) => {
        const field = state.schema.steps.flatMap(s => s.fields).find(f => f.id === fieldId);
        if (field?.type === 'submit') return state;

        const newSteps = state.schema.steps.map(step => {
          const remainingFields = step.fields.filter(f => f.id !== fieldId);
          const grouped = _.groupBy(remainingFields, 'field_order');
          const fixedFields = Object.values(grouped).flatMap(row => 
            row.sort((a,b) => (a.column_index || 0) - (b.column_index || 0))
              .map((f, i) => ({ ...f, column_index: i + 1 }))
          );
          
          return {
            ...step,
            fields: fixedFields
          };
        });
        
        return {
          schema: { ...state.schema, steps: newSteps },
          selectedFieldId: state.selectedFieldId === fieldId ? null : state.selectedFieldId
        };
      }),

      updateField: (fieldId, updates) => set((state) => {
        const newSteps = state.schema.steps.map(step => ({
          ...step,
          fields: step.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
        }));
        return { schema: { ...state.schema, steps: newSteps } };
      }),

      setSelectedField: (fieldId) => set({ selectedFieldId: fieldId }),

      moveField: (fieldId, overId, position) => set((state) => {
         const allFields = state.schema.steps.flatMap(s => s.fields);
         const sourceField = allFields.find(f => f.id === fieldId);
         const targetField = allFields.find(f => f.id === overId);
         
         if (!sourceField || !targetField || fieldId === overId) return state;

         const newSteps = state.schema.steps.map(step => {
            const fields = [...step.fields];
            const targetInStep = fields.find(f => f.id === overId);
            if (!targetInStep) return step;

            const filteredFields = fields.filter(f => f.id !== fieldId);
            
            if (position === 'top' || position === 'bottom') {
               const targetIndex = filteredFields.findIndex(f => f.id === overId);
               const newOrder = position === 'top' ? targetField.field_order : targetField.field_order + 1;
               const shifted = filteredFields.map(f => f.field_order >= newOrder ? { ...f, field_order: f.field_order + 1 } : f);
               shifted.splice(targetIndex + (position === 'bottom' ? 1 : 0), 0, { 
                 ...sourceField, 
                 field_order: newOrder, 
                 column_index: 1 
               });
               return { ...step, fields: shifted };
            } else {
               const targetIndex = filteredFields.findIndex(f => f.id === overId);
               const targetColumnIndex = targetField.column_index || 1;
               const newColumnIndex = position === 'left' ? targetColumnIndex : targetColumnIndex + 1;
               const shifted = filteredFields.map(f => (f.field_order === targetField.field_order && (f.column_index || 1) >= newColumnIndex) ? { ...f, column_index: (f.column_index || 1) + 1 } : f);
               shifted.splice(targetIndex + (position === 'right' ? 1 : 0), 0, { 
                 ...sourceField, 
                 field_order: targetField.field_order, 
                 column_index: newColumnIndex 
               });
               return { ...step, fields: shifted };
            }
         });

         return { schema: { ...state.schema, steps: newSteps } };
      }),

      
    }),
    {
      name: 'form-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ schema: state.schema, activeStepId: state.activeStepId }),
    }
  )
);
