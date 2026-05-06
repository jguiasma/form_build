import type { FormField, FormSchema } from "../../form-editor/types/form-builder.types";

export type PublicFormSchema = FormSchema;
export type PublicFormField = FormField;

export type PublicFormValues = Record<string | number, any>;
export type PublicFormErrors = Record<string | number, string>;

export type StartFormResponse = {
  response_id: number;
};

export type SaveAnswer = {
  field_id: string | number | undefined;
  value: string;
};

export type SaveAnswersPayload = {
  response_id: number;
  answers: SaveAnswer[];
};

export type SubmitFormPayload = Record<string, any> & {
  response_id: number;
};
