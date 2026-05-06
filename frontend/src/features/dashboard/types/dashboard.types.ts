export type DashboardTab = "dashboard" | "my-forms" | "submissions" | "insights" | "settings" | "support";

export interface DashboardProfile {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}

export interface DashboardExportAnswer {
  field_id?: number | string;
  value: unknown;
  field?: {
    label?: string;
  };
}

export interface DashboardExportRow {
  id: number | string;
  status: string;
  created_at: string;
  form?: {
    title?: string;
  };
  user?: {
    name?: string | null;
    email?: string | null;
  };
  answers?: DashboardExportAnswer[];
}

export interface TelescopeLog {
  uuid: string;
  created_at: string;
  content?: {
    message?: string;
    context?: Record<string, any>;
  };
}

