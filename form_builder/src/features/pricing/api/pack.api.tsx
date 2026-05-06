import api from "../../../shared/api/api";
import type { Pack } from "../types/pack.type.ts";

export const packApi = {
    getPacks: async (): Promise<Pack[]> => {
        const response = await api.get("/packs");
        return response.data;
    }
};