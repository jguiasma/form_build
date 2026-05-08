import React from 'react';
import type { FormField } from '../../types/form-builder.types';

interface Props {
  field: FormField;
  updateField: (id: string | number, updates: Partial<FormField>) => void;
}

const DATE_FORMATS = [
  { label: 'YYYY-MM-DD', value: 'Y-m-d' },
  { label: 'DD/MM/YYYY', value: 'd/m/Y' },
  { label: 'MM/DD/YYYY', value: 'm/d/Y' },
  { label: 'DD-MM-YYYY', value: 'd-m-Y' },
];

const DateProperties: React.FC<Props> = ({ field, updateField }) => {
  const rules = field.validation_rules || {};

  const updateRule = (key: string, value: any) => {
    updateField(field.id!, {
      validation_rules: { ...rules, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Date Format</label>
        <div className="grid grid-cols-2 gap-2">
          {DATE_FORMATS.map((fmt) => (
            <button
              key={fmt.value}
              onClick={() => updateRule('format', fmt.value)}
              className={`py-2.5 px-3 rounded-xl text-[10px] font-black transition-all ${
                (rules.format || 'Y-m-d') === fmt.value
                  ? 'bg-[#1148ad] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Min Date</label>
          <input
            type="date"
            value={rules.min_date || ''}
            onChange={(e) => updateRule('min_date', e.target.value || null)}
            className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold shadow-inner"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Max Date</label>
          <input
            type="date"
            value={rules.max_date || ''}
            onChange={(e) => updateRule('max_date', e.target.value || null)}
            className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold shadow-inner"
          />
        </div>
      </div>

      {rules.min_date && rules.max_date && (
        <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl">
          <p className="text-[10px] font-bold text-emerald-600 text-center">
            Range: <span className="font-black">{rules.min_date}</span> to <span className="font-black">{rules.max_date}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DateProperties;
