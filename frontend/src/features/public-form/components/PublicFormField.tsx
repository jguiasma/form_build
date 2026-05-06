import { AlertCircle, Calendar, CheckCircle2, Link, Loader2, Phone, Send, Star } from "lucide-react";
import type {
  PublicFormErrors,
  PublicFormField as PublicFormFieldType,
  PublicFormValues,
} from "../types/public-form.types";

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
  const value = values[field.id!] || "";
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

    case "grouped":
      return (
        <div className="space-y-3">
          {labelArea}
          <input
            type="text"
            placeholder="Rue"
            value={value?.rue || ""}
            onChange={(event) => onChange(field.id!, { ...value, rue: event.target.value })}
            className={inputClasses}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Ville"
              value={value?.ville || ""}
              onChange={(event) => onChange(field.id!, { ...value, ville: event.target.value })}
              className={inputClasses}
            />
            <input
              type="text"
              placeholder="Code postal"
              value={value?.zip || ""}
              onChange={(event) => onChange(field.id!, { ...value, zip: event.target.value })}
              className={inputClasses}
            />
          </div>
        </div>
      );

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
