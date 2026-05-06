import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export const useTelescopeLogs = () => {
  const logsQuery = useQuery({
    queryKey: ["telescopeLogs"],
    queryFn: dashboardApi.getTelescopeLogs,
  });

  const logs = logsQuery.data ?? [];

  return {
    logs,
    isLoading: logsQuery.isLoading,
  };
};
