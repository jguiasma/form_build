import api from "../../../shared/api/api";
import type { Category } from "../types/categorie.type";

export const categorieApi = {
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get("/form-categories");
        return response.data;
    }
};