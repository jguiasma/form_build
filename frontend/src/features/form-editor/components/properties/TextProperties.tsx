import React from 'react';
import type { FormField } from '../../types/form-builder.types';

interface Props {
  field: FormField;
  updateField: (id: string | number, updates: Partial<FormField>) => void;
}

const TextProperties: React.FC<Props> = ({ field, updateField }) => {
  const rules = field.validation_rules || {};

  const updateRule = (key: string, value: any) => {
    updateField(field.id, {
      validation_rules: { ...rules, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Min Length</label>
          <input 
            type="number"
            value={rules.min_length || ''}
            onChange={(e) => updateRule('min_length', e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black shadow-inner"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Max Length</label>
          <input 
            type="number"
            value={rules.max_length || ''}
            onChange={(e) => updateRule('max_length', e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black shadow-inner"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Custom Regex Pattern</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-mono text-xs">/</span>
          <input 
            type="text"
            value={rules.pattern || ''}
            onChange={(e) => updateRule('pattern', e.target.value)}
            placeholder="[a-z0-9]+"
            className="w-full pl-7 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-mono font-bold shadow-inner"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-mono text-xs">/g</span>
        </div>
        <p className="text-[9px] font-bold text-slate-400 mt-2 italic px-1 text-center">
          * Use to enforce custom formats like ID numbers or SKU codes.
        </p>
      </div>
    </div>
  );
};

export default TextProperties;

