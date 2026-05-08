export interface FieldOption {
  id?: number | string;
  field_id?: number | string;
  label: string;
  value: string;
  option_order: number;
}

export interface FormField {
  id?: number | string;
  step_id?: number | string;
  label: string;
  field_key: string;
  type: string;
  placeholder?: string | null;
  default_value?: string | null;
  description?: string | null;
  custom_error_message?: string | null;
  is_required: boolean;
  validation_rules?: any;
  field_order: number;
  column_index?: number;
  column_span?: number;
  options?: FieldOption[];
}

export interface FormStep {
  id?: number | string;
  form_id?: number | string;
  title: string;
  description?: string | null;
  step_order: number;
  is_required?: boolean;
  fields: FormField[];
}

export interface FormVersion {
  id: number | string;
  version: string;
  share_link?: string | null;
  created_at: string;
}

export interface FormSchema {
  id?: number | string;
  uuid?: string;
  form_category_id?: number | string;
  form_type_id?: number | string;
  title: string;
  description?: string | null;
  status?: string;
  steps: FormStep[];
  versions?: FormVersion[];
}

export interface FormType {
  id: number | string;
  name: string;
  description: string;
  is_active: boolean;
}
