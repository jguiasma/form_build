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

export interface FormSchema {
  id?: number | string;
  form_type_id?: number | string;
  title: string;
  description?: string | null;
  status?: string;
  steps: FormStep[];
  require_biometrics?: boolean;
}

export interface FormType {
  id: number | string;
  name: string;
  description: string;
  is_active: boolean;
}
