import type {
  PublicFormErrors,
  PublicFormField,
  PublicFormValues,
} from "../types/public-form.types";

export const validatePublicFormField = (field: PublicFormField, value: any) => {
  const rules = field.validation_rules || {};
  const validateValueFormat = (type: string, fieldValue: any) => {
    if (fieldValue === "" || fieldValue === null || fieldValue === undefined) {
      return null;
    }

    const stringValue = String(fieldValue);

    if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
      return "Please enter a valid email address";
    }

    if (
      type === "url" &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(stringValue)
    ) {
      return "Please enter a valid URL";
    }

    if (type === "phone" && !/^\+?[\d\s().-]{7,20}$/.test(stringValue)) {
      return "Please enter a valid phone number";
    }

    if (type === "number" && isNaN(Number(stringValue))) {
      return "Please enter a valid number";
    }

    if (type === "date") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
        return "Please enter a valid date";
      }

      const date = new Date(`${stringValue}T00:00:00Z`);
      const normalizedDate = date.toISOString().slice(0, 10);

      if (Number.isNaN(date.getTime()) || normalizedDate !== stringValue) {
        return "Please enter a valid date";
      }
    }

    if (type === "select" && stringValue.trim() === "") {
      return "Please select a valid option";
    }

    return null;
  };

  if (field.is_required) {
    if (field.type === "grouped") {
      const rows = rules.grouped_config?.rows;

      if (rows) {
        const hasEmptyGroupedField = Object.entries(rows).some(([, row]: any) =>
          Object.entries(row.cols || {}).some(([colKey]) => {
            const valueKey = `${Object.keys(rows).find((key) => rows[key] === row)}_${colKey}`;
            return !value?.[valueKey];
          })
        );

        if (hasEmptyGroupedField) {
          return field.custom_error_message || "Please complete all grouped fields";
        }
      } else if (!value || Object.values(value).some((item) => !item)) {
        return field.custom_error_message || "Please complete all grouped fields";
      }
    } else if (field.type === "matrix") {
      const rows = rules.matrix_config?.rows || [];
      if (rows.length > 0 && rows.some((row: string) => !value?.[row])) {
        return field.custom_error_message || "Please complete all matrix rows";
      }
    } else if (field.type === "conditional") {
      if (!value?.enabled) {
        return field.custom_error_message || "This field is required";
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

  if (field.type === "grouped") {
    const rows = rules.grouped_config?.rows;

    if (rows && value && typeof value === "object") {
      for (const [rowKey, row] of Object.entries(rows) as any) {
        for (const [colKey, col] of Object.entries(row.cols || {}) as any) {
          const valueKey = `${rowKey}_${colKey}`;
          const error = validateValueFormat(col.type || "text", value[valueKey]);

          if (error) {
            return error;
          }
        }
      }
    }
  }

  if (value && typeof value === "string") {
    const formatError = validateValueFormat(field.type, value);

    if (formatError) {
      return formatError;
    }

    if ((field.type === "text" || field.type === "textarea") && rules.min_length) {
      if (value.length < Number(rules.min_length)) {
        return `Minimum ${rules.min_length} characters`;
      }
    }

    if ((field.type === "text" || field.type === "textarea") && rules.max_length) {
      if (value.length > Number(rules.max_length)) {
        return `Maximum ${rules.max_length} characters`;
      }
    }

    if ((field.type === "text" || field.type === "textarea") && rules.pattern) {
      try {
        if (!new RegExp(rules.pattern).test(value)) {
          return "Invalid format";
        }
      } catch (error) {
        console.error("Invalid regex pattern", rules.pattern);
      }
    }
  }

  if (value !== "" && value !== null && value !== undefined) {
    if (field.type === "number") {
      const numberValue = Number(value);

      if (rules.min !== undefined && rules.min !== null && numberValue < Number(rules.min)) {
        return `Minimum value is ${rules.min}`;
      }

      if (rules.max !== undefined && rules.max !== null && numberValue > Number(rules.max)) {
        return `Maximum value is ${rules.max}`;
      }
    }

    if (field.type === "slider") {
      const sliderConfig = rules.slider_config || {};
      const numberValue = Number(value);
      const min = Number(sliderConfig.min ?? 0);
      const max = Number(sliderConfig.max ?? 100);

      if (numberValue < min) return `Minimum value is ${min}`;
      if (numberValue > max) return `Maximum value is ${max}`;
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
      errors[field.id!] = error;
    }
  });

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
