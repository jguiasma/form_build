import React from 'react';
import type { FormField } from '../../types/form-builder.types';

interface Props {
  field: FormField;
  updateField: (id: string | number, updates: Partial<FormField>) => void;
}

const NumberProperties: React.FC<Props> = ({ field, updateField }) => {
  const rules = field.validation_rules || {};

  const updateRule = (key: string, value: any) => {
    updateField(field.id!, {
      validation_rules: { ...rules, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Min Value</label>
          <input
            type="number"
            value={rules.min ?? ''}
            onChange={(e) => updateRule('min', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="No min"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black shadow-inner"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Max Value</label>
          <input
            type="number"
            value={rules.max ?? ''}
            onChange={(e) => updateRule('max', e.target.value === '' ? null : Number(e.target.value))}
            placeholder="No max"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black shadow-inner"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Step Increment</label>
        <div className="flex gap-2">
          {['1', '0.1', '0.01', 'any'].map((step) => (
            <button
              key={step}
              onClick={() => updateRule('step', step)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                (rules.step || 'any') === step
                  ? 'bg-[#1148ad] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>

      {(rules.min !== null && rules.min !== undefined) && (rules.max !== null && rules.max !== undefined) && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
          <p className="text-[10px] font-bold text-blue-600 text-center">
            Accepted range: <span className="font-black">{rules.min} → {rules.max}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default NumberProperties;
