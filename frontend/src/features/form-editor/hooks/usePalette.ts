import { useQuery } from "@tanstack/react-query";
import { formApi } from "../api/form.api";

export const usePalette = (categoryId?: number | string) => {
  return useQuery({
    queryKey: ["palette", categoryId],
    queryFn: () => formApi.getPalette(categoryId),
  });
};
