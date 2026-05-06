import { dashboardApi } from "../api/dashboard.api";
import type { DashboardExportRow } from "../types/dashboard.types";

const quoteCsvValue = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const buildGlobalReportCsv = (rows: DashboardExportRow[]) => {
  const allFieldKeys = new Set<string>();

  rows.forEach((row) => {
    row.answers?.forEach((answer) => {
      allFieldKeys.add(answer.field?.label || `Field ${answer.field_id}`);
    });
  });

  const dynamicHeaders = Array.from(allFieldKeys);
  const headers = ["Submission ID", "Form Title", "User Name", "User Email", "Status", "Date", ...dynamicHeaders];

  const csvRows = rows.map((row) => {
    const baseRow = [
      `FB-${row.id}-X`,
      row.form?.title || "Unknown",
      row.user?.name || "Anonymous",
      row.user?.email || "N/A",
      row.status,
      new Date(row.created_at).toLocaleString(),
    ];

    const answerMap = new Map<string, unknown>();
    row.answers?.forEach((answer) => {
      answerMap.set(answer.field?.label || `Field ${answer.field_id}`, answer.value);
    });

    const answerValues = dynamicHeaders.map((key) => {
      const value = answerMap.get(key);
      return typeof value === "object" && value !== null ? JSON.stringify(value) : value ?? "";
    });

    return [...baseRow, ...answerValues].map(quoteCsvValue).join(",");
  });

  return [headers.map(quoteCsvValue).join(","), ...csvRows].join("\n");
};

export const useGlobalExport = () => {
  const exportGlobalReport = async () => {
    try {
      const rows = await dashboardApi.exportAllForms();
      if (!rows.length) return;

      const csvContent = `data:text/csv;charset=utf-8,${buildGlobalReportCsv(rows)}`;
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `Global-Report-${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return { exportGlobalReport };
};
