import { useSearchParams } from "react-router-dom";
import type { DashboardTab } from "../types/dashboard.types";

export const useDashboardTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") || "dashboard") as DashboardTab;
  const selectedFormId = searchParams.get("formId") ? Number(searchParams.get("formId")) : null;

  const setActiveTab = (tab: DashboardTab, formId: number | null = selectedFormId) => {
    const params: Record<string, string> = { tab };

    if (formId && (tab === "submissions" || tab === "insights")) {
      params.formId = String(formId);
    }

    setSearchParams(params);
  };

  return {
    activeTab,
    selectedFormId,
    setActiveTab,
  };
};
