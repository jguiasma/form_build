import type {
  PublicFormErrors,
  PublicFormField,
  PublicFormValues,
} from "../types/public-form.types";

export const validatePublicFormField = (field: PublicFormField, value: any) => {
  if (field.is_required) {
    if (field.type === "grouped") {
      if (!value?.rue || !value?.ville || !value?.zip) {
        return "Please complete all address fields";
      }
    } else if (
      value === "" ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return field.custom_error_message || "This field is required";
    }
  }

  if (value && typeof value === "string") {
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email address";
    }
    if (
      field.type === "url" &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(value)
    ) {
      return "Invalid URL";
    }
    if (field.type === "number" && isNaN(Number(value))) {
      return "Must be a number";
    }
  }

  return null;
};

export const validatePublicFormStep = (
  fields: PublicFormField[],
  values: PublicFormValues
) => {
  const errors: PublicFormErrors = {};

  fields.forEach((field) => {
    const value = values[field.id!] ?? "";
    const error = validatePublicFormField(field, value);

    if (error) {
      errors[field.id!] =
        error === "Invalid email address"
          ? "Please enter a valid email address"
          : error === "Invalid URL"
          ? "Please enter a valid URL"
          : error === "Must be a number"
          ? "Please enter a valid number"
          : error;
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
