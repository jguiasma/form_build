import React from 'react';
import type { FormField } from '../../types/form-builder.types';

interface Props {
  field: FormField;
  updateField: (id: string | number, updates: Partial<FormField>) => void;
}

const TextareaProperties: React.FC<Props> = ({ field, updateField }) => {
  const rules = field.validation_rules || {};

  const updateRule = (key: string, value: any) => {
    updateField(field.id!, {
      validation_rules: { ...rules, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Rows (Height)</label>
        <input
          type="range"
          min={3}
          max={10}
          value={rules.rows || 4}
          onChange={(e) => updateRule('rows', Number(e.target.value))}
          className="w-full accent-[#1148ad]"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-bold text-slate-400">3 rows</span>
          <span className="text-xs font-black text-[#1148ad]">{rules.rows || 4} rows</span>
          <span className="text-[10px] font-bold text-slate-400">10 rows</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Min Length</label>
          <input
            type="number"
            value={rules.min_length || ''}
            onChange={(e) => updateRule('min_length', e.target.value ? Number(e.target.value) : null)}
            placeholder="None"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black shadow-inner"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Max Length</label>
          <input
            type="number"
            value={rules.max_length || ''}
            onChange={(e) => updateRule('max_length', e.target.value ? Number(e.target.value) : null)}
            placeholder="1000"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black shadow-inner"
          />
        </div>
      </div>

      {rules.max_length && (
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <p className="text-[10px] font-bold text-slate-500 text-center">
            Character limit: <span className="text-[#1148ad] font-black">{rules.max_length}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TextareaProperties;

