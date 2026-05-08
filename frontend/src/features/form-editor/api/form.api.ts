import api from "../../../shared/api/api";
import type { FieldOption, FormSchema, FormType } from "../types/form-builder.types";

export type CreateFormPayload = {
  title: string;
  description?: string;
  form_type_id: number | string;
  form_category_id: number | string;
};

export type FormsQueryParams = {
  search?: string;
  status?: string;
  form_type_id?: string | number;
  page?: number;
};

export type FormsListResponse = {
  data: any[];
  total: number;
  current_page: number;
  last_page: number;
};

export const formApi = {
  getFieldTypes: async (): Promise<FormType[]> => {
    const { data } = await api.get("/form-types");
    return data;
  },

  getForm: async (id: string | number): Promise<FormSchema> => {
    const { data } = await api.get(`/admin/forms/${id}`);
    return data.data ?? data;
  },

  createForm: async (formData: CreateFormPayload): Promise<FormSchema> => {
    const { data } = await api.post("/admin/forms", formData);
    return data.data ?? data;
  },

  updateFormSchema: async (id: string | number, schema: FormSchema): Promise<FormSchema> => {
    const { data } = await api.put(`/admin/forms/${id}`, schema);
    return data.data ?? data;
  },

  updateStep: async (
    id: string | number,
    data: { title?: string; description?: string }
  ) => {
    const response = await api.put(`/admin/steps/${id}`, data);
    return response.data;
  },

  deleteStep: async (id: string | number) => {
    const response = await api.delete(`/admin/steps/${id}`);
    return response.data;
  },

  publishForm: async (id: string | number) => {
    const { data } = await api.post(`/admin/forms/${id}/publish`);
    return data;
  },

  getForms: async (params: FormsQueryParams = {}): Promise<FormsListResponse> => {
    const { data } = await api.get("/admin/forms", { params });
    const paginator = data.data?.data ? data.data : data;

    return {
      data: paginator.data ?? [],
      total: paginator.total ?? 0,
      current_page: paginator.current_page ?? 1,
      last_page: paginator.last_page ?? 1,
    };
  },

  getFormResponses: async (formId: number | string): Promise<any[]> => {
    const { data } = await api.get(`/admin/forms/${formId}/responses`);
    return data.data?.data ?? data.data ?? data;
  },

  deleteForm: async (id: string | number) => {
    const { data } = await api.delete(`/admin/forms/${id}`);
    return data;
  },

  archiveForm: async (id: string | number) => {
    const { data } = await api.put(`/admin/forms/${id}`, { status: "archived" });
    return data;
  },

  getGlobalStats: async (): Promise<any> => {
    const { data } = await api.get("/admin/stats");
    return data.data;
  },

  getPalette: async (categoryId?: number | string): Promise<any[]> => {
    const { data } = await api.get("/form-fields/palette", {
      params: categoryId ? { category_id: categoryId } : undefined,
    });
    if (Array.isArray(data)) {
      return data;
    }

    return Object.entries(data || {}).flatMap(([category, fields]) =>
      Array.isArray(fields)
        ? fields.map((field) => ({ ...field, category }))
        : []
    );
  },
};

export const fieldOptionsApi = {
  getFieldOptions: async (fieldId: string | number): Promise<FieldOption[]> => {
    const { data } = await api.get(`/admin/fields/${fieldId}/options`);
    return data.data;
  },

  addFieldOption: async (
    fieldId: string | number,
    option: Partial<FieldOption>
  ): Promise<FieldOption> => {
    const { data } = await api.post(`/admin/fields/${fieldId}/options`, option);
    return data.data;
  },

  updateFieldOption: async (
    fieldId: string | number,
    option: Partial<FieldOption> & { id: string | number }
  ): Promise<FieldOption> => {
    const { data } = await api.put(`/admin/fields/${fieldId}/options`, option);
    return data.data;
  },

  deleteFieldOption: async (fieldId: string | number, optionId: string | number) => {
    await api.delete(`/admin/fields/${fieldId}/options`, { data: { id: optionId } });
  },

  reorderFieldOptions: async (fieldId: string | number, order: Array<string | number>) => {
    await api.post(`/admin/fields/${fieldId}/options/reorder`, { order });
  },
};
