const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value: unknown, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return value === true || value === 1 || value === "1" || value === "true" || value === "on";
};

export const getSliderConfig = (config: any = {}) => ({
  mode: config.mode || "single",
  min: toNumber(config.min, 0),
  max: toNumber(config.max, 100),
  step: toNumber(config.step, 1),
  unit: config.unit || "",
  showValue: toBoolean(config.show_value, true),
});

export const getMatrixRows = (config: any = {}) => {
  if (Array.isArray(config.rows)) {
    const rows = config.rows.map((row: unknown) => String(row).trim()).filter(Boolean);
    if (rows.length) return rows;
  }

  return ["Row 1", "Row 2"];
};

export const getMatrixColumns = (config: any = {}) => {
  if (Array.isArray(config.columns)) {
    const columns = config.columns.map((column: unknown) => String(column).trim()).filter(Boolean);
    if (columns.length) return columns;
  }

  if (config.scale_type === "numeric10") {
    return Array.from({ length: 10 }, (_, index) => String(index + 1));
  }

  if (config.scale_type === "stars") {
    return ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"];
  }

  if (config.scale_type === "emoji") {
    return ["Very bad", "Bad", "Neutral", "Good", "Excellent"];
  }

  if (config.scale_type === "text" && typeof config.text_labels === "string") {
    const labels = config.text_labels.split(",").map((label: string) => label.trim()).filter(Boolean);
    if (labels.length) return labels;
  }

  return ["1", "2", "3", "4", "5"];
};

export const getConditionalLabels = (config: any = {}) => {
  const operatorLabels: Record<string, string> = {
    equals: "equals",
    not_equals: "does not equal",
    contains: "contains",
    greater_than: "is greater than",
    less_than: "is less than",
  };

  const trigger = config.trigger_field_key || "selected field";
  const operator = operatorLabels[config.operator] || config.operator || "matches";
  const value = config.trigger_value || "value";
  const innerType = config.inner_type || "field";

  return {
    conditionLabel: `When ${trigger} ${operator} ${value}`,
    actionLabel: `Show ${innerType} field`,
  };
};
