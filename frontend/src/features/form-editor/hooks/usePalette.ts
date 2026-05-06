import { useQuery } from "@tanstack/react-query";
import { formApi } from "../api/form.api";

export const usePalette = () => {
  return useQuery({
    queryKey: ["palette"],
    queryFn: formApi.getPalette,
  });
};
