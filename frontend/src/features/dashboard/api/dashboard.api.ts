import api from "../../../shared/api/api";
import type { DashboardExportRow, TelescopeLog } from "../types/dashboard.types";

export const dashboardApi = {
  exportAllForms: async (): Promise<DashboardExportRow[]> => {
    const { data } = await api.get("/admin/forms/export/all");
    return data.data ?? [];
  },

  getTelescopeLogs: async (): Promise<TelescopeLog[]> => {
    const { data } = await api.get("/admin/telescope/logs");
    return data.data ?? [];
  },
};
