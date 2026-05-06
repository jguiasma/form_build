import api from "../../../shared/api/api";
import type { Pack } from "../types/pricing.types";

export const pricingApi = {
  getPacks: async (): Promise<Pack[]> => { //le resultat est pack[]
    const { data } = await api.get("packs");
    return data.data.data;
  },
};
