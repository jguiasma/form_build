import { AlertCircle, Calendar, CheckCircle2, Link, Loader2, Phone, Send, Star } from "lucide-react";
import type {
  PublicFormErrors,
  PublicFormField as PublicFormFieldType,
  PublicFormValues,
} from "../types/public-form.types";
import {
  getConditionalLabels,
  getMatrixColumns,
  getMatrixRows,
  getSliderConfig,
} from "../../form-editor/lib/fieldConfig";

type PublicFormFieldProps = {
  field: PublicFormFieldType;
  values: PublicFormValues;
  errors: PublicFormErrors;
  submitting: boolean;
  onChange: (fieldId: string | number, value: any) => void;
  onToggleChoice: (fieldId: string | number, value: any) => void;
  onSubmit: () => void;
};

export const PublicFormField = ({
  field,
  values,
  errors,
  submitting,
  onChange,
  onToggleChoice,
  onSubmit,
}: PublicFormFieldProps) => {
  const rawValue = values[field.id!];
  const value = rawValue || "";
  const error = errors[field.id!];
  const isSelected = (optionValue: any) => values[field.id!] === optionValue;

  const labelArea = (
    <div className="flex justify-between items-center mb-1.5">
      <label className="text-xs font-bold text-slate-700">
        {field.is_required && <span className="text-rose-500 mr-1">*</span>}
        {field.label}
      </label>
      {error && <span className="text-[10px] font-bold text-rose-500">{error}</span>}
    </div>
  );

  const inputClasses = `w-full px-4 py-3 bg-white border ${
    error ? "border-rose-400 ring-4 ring-rose-50" : "border-slate-200"
  } rounded-xl text-sm focus:outline-none focus:border-[#1148ad] focus:ring-4 focus:ring-blue-50/50 transition-all`;

  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "phone":
    case "url":
      return (
        <div className="space-y-1">
          {labelArea}
          <div className="relative">
            <input
              type={field.type === "url" ? "url" : field.type === "phone" ? "tel" : field.type}
              value={value}
              onChange={(event) => onChange(field.id!, event.target.value)}
              placeholder={field.placeholder || ""}
              className={inputClasses}
            />
            {field.type === "email" && value && !value.includes("@") && (
              <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
            )}
            {field.type === "phone" && (
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            )}
            {field.type === "url" && (
              <Link className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            )}
          </div>
          {field.description && (
            <p className="text-[10px] text-slate-400 italic mt-1">{field.description}</p>
          )}
        </div>
      );

    case "textarea":
      return (
        <div className="space-y-1">
          {labelArea}
          <textarea
            value={value}
            onChange={(event) => onChange(field.id!, event.target.value)}
            placeholder={field.placeholder || ""}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1148ad] min-h-[100px] transition-all"
          />
          {field.description && (
            <p className="text-[10px] text-slate-400 italic mt-1">{field.description}</p>
          )}
        </div>
      );

    case "select":
      return (
        <div className="space-y-1">
          {labelArea}
          <select
            value={value}
            onChange={(event) => onChange(field.id!, event.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1148ad] appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="">Select choice...</option>
            {field.options?.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
    case "radio":
      return (
        <div className="space-y-3">
          {labelArea}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {field.options?.map((option) => (
              <div
                key={option.id}
                onClick={() => onToggleChoice(field.id!, option.value)}
                className={`flex items-center gap-3 p-3 border rounded-xl transition-all cursor-pointer group ${
                  isSelected(option.value)
                    ? "bg-blue-50 border-blue-200"
                    : "bg-slate-50/50 border-slate-100 hover:bg-white hover:border-blue-200"
                }`}
              >
                <div
                  className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected(option.value)
                      ? "bg-[#1148ad] border-[#1148ad]"
                      : "bg-white border-slate-200 group-hover:border-blue-300"
                  }`}
                >
                  {isSelected(option.value) && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <span
                  className={`text-xs font-bold ${
                    isSelected(option.value) ? "text-[#1148ad]" : "text-slate-600"
                  }`}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case "date":
      return (
        <div className="space-y-1">
          {labelArea}
          <div className="relative">
            <input
              type="date"
              value={value}
              onChange={(event) => onChange(field.id!, event.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1148ad] transition-all"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      );

    case "rating":
      return (
        <div className="space-y-2">
          {labelArea}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={rating}
                onClick={() => onChange(field.id!, rating)}
                className={`w-6 h-6 cursor-pointer transition-colors ${
                  rating <= (value || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200 hover:text-amber-200"
                }`}
              />
            ))}
          </div>
        </div>
      );

    case "slider": {
      const config = getSliderConfig(field.validation_rules?.slider_config);
      const { min, max, step, unit, showValue } = config;
      const currentValue =
        rawValue === undefined || rawValue === ""
          ? Number(field.default_value ?? min)
          : Number(rawValue);
      const safeValue = Math.min(Math.max(currentValue, min), max);

      return (
        <div className="space-y-3">
          {labelArea}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={safeValue}
            onChange={(event) => onChange(field.id!, event.target.value)}
            className="w-full accent-[#1148ad]"
          />
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>{min}{unit}</span>
            {showValue && <span className="text-[#1148ad]">{safeValue}{unit}</span>}
            <span>{max}{unit}</span>
          </div>
        </div>
      );
    }

    case "matrix": {
      const config = field.validation_rules?.matrix_config || {};
      const rows = getMatrixRows(config);
      const columns = getMatrixColumns(config);
      const display = config.display || "radio";
      const matrixValue = typeof rawValue === "object" && rawValue !== null ? rawValue : {};

      return (
        <div className="space-y-3">
          {labelArea}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div
              className="grid bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest"
              style={{ gridTemplateColumns: `1.2fr repeat(${columns.length}, minmax(0, 1fr))` }}
            >
              <div className="p-3" />
              {columns.map((column: string, index: number) => (
                <div key={index} className="p-3 text-center truncate">
                  {column}
                </div>
              ))}
            </div>
            {rows.map((row: string, rowIndex: number) => (
              <div
                key={rowIndex}
                className="grid border-t border-slate-100"
                style={{ gridTemplateColumns: `1.2fr repeat(${columns.length}, minmax(0, 1fr))` }}
              >
                <div className="p-3 text-xs font-bold text-slate-600 truncate">{row}</div>
                {columns.map((column: string, columnIndex: number) => {
                  const selected = matrixValue[row] === column;

                  return (
                    <button
                      key={columnIndex}
                      type="button"
                      onClick={() => onChange(field.id!, { ...matrixValue, [row]: column })}
                      className="p-3 flex justify-center"
                    >
                      {display === "slider" ? (
                        <span
                          className={`h-1.5 w-full rounded-full ${
                            selected ? "bg-[#1148ad]" : "bg-slate-200"
                          }`}
                        />
                      ) : (
                        <span
                          className={`size-4 rounded-full border-2 ${
                            selected ? "bg-[#1148ad] border-[#1148ad]" : "border-slate-300 bg-slate-50"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "conditional": {
      const { conditionLabel, actionLabel } = getConditionalLabels(
        field.validation_rules?.conditional_config
      );

      return (
        <div className="space-y-3">
          {labelArea}
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
            <div className="text-xs font-black uppercase tracking-widest text-[#1148ad]">
              {conditionLabel}
            </div>
            <label className="flex items-center gap-3 rounded-lg border border-blue-100 bg-white p-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(rawValue?.enabled)}
                onChange={(event) =>
                  onChange(field.id!, { ...(typeof rawValue === "object" ? rawValue : {}), enabled: event.target.checked })
                }
                className="size-4 accent-[#1148ad]"
              />
              <span className="text-xs font-bold text-slate-600">{actionLabel}</span>
            </label>
          </div>
        </div>
      );
    }

    case "grouped": {
      const config = field.validation_rules?.grouped_config;
      const groupedValue = typeof rawValue === "object" && rawValue !== null ? rawValue : {};

      if (!config?.rows) {
        return (
          <div className="space-y-3">
            {labelArea}
            <input
              type="text"
              placeholder="Field 1"
              value={groupedValue.field_1 || ""}
              onChange={(event) => onChange(field.id!, { ...groupedValue, field_1: event.target.value })}
              className={inputClasses}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Field 2"
                value={groupedValue.field_2 || ""}
                onChange={(event) => onChange(field.id!, { ...groupedValue, field_2: event.target.value })}
                className={inputClasses}
              />
              <input
                type="text"
                placeholder="Field 3"
                value={groupedValue.field_3 || ""}
                onChange={(event) => onChange(field.id!, { ...groupedValue, field_3: event.target.value })}
                className={inputClasses}
              />
            </div>
          </div>
        );
      }

      const rows = config.rows as Record<
        string,
        {
          num_cols: number;
          cols: Record<string, { type: string; label?: string; placeholder?: string }>;
        }
      >;

      return (
        <div className="space-y-4">
          {labelArea}
          {Object.entries(rows).map(([rowKey, row]) => {
            const cols = row.cols ? Object.entries(row.cols) : [];
            const numCols = Math.max(cols.length, 1);

            return (
              <div
                key={rowKey}
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
              >
                {cols.map(([colKey, col]) => {
                  const valueKey = `${rowKey}_${colKey}`;
                  const colValue = groupedValue[valueKey] || "";
                  const updateGroupedValue = (nextValue: string) =>
                    onChange(field.id!, { ...groupedValue, [valueKey]: nextValue });

                  return (
                    <div key={colKey} className="space-y-1">
                      {col.label && (
                        <label className="text-xs font-bold text-slate-700">{col.label}</label>
                      )}
                      {col.type === "textarea" ? (
                        <textarea
                          value={colValue}
                          onChange={(event) => updateGroupedValue(event.target.value)}
                          placeholder={col.placeholder || ""}
                          className={`${inputClasses} min-h-[80px]`}
                        />
                      ) : col.type === "select" ? (
                        <select
                          value={colValue}
                          onChange={(event) => updateGroupedValue(event.target.value)}
                          className={inputClasses}
                        >
                          <option value="">{col.placeholder || "Select..."}</option>
                        </select>
                      ) : (
                        <input
                          type={col.type || "text"}
                          value={colValue}
                          onChange={(event) => updateGroupedValue(event.target.value)}
                          placeholder={col.placeholder || ""}
                          className={inputClasses}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }

    case "submit":
      return (
        <div className="pt-4">
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {field.label || "Submit Form"}
          </button>
        </div>
      );

    default:
      return null;
  }
};
