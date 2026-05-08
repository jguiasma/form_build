import api from "../../../shared/api/api";
import type { Pack } from "../types/pricing.types";

export const pricingApi = {
  getPacks: async (): Promise<Pack[]> => {
    const { data } = await api.get("packs");
    return data.data?.data ?? data.data ?? data;
  },
};
