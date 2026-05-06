import api from "../../../shared/api/api";
import type { FormSchema } from "../types/form-builder.types";

export const formApi = {
  getForm: async (id: string | number): Promise<FormSchema> => {
    const { data } = await api.get(`/admin/forms/${id}`);
    return data.data;
  },
};
