import { useQuery } from "@tanstack/react-query";
import { pricingApi } from "../api/pricing.api";

export const usePacks = () => {
  return useQuery({
    queryKey: ["packs"],
    queryFn: pricingApi.getPacks,
  });
};
