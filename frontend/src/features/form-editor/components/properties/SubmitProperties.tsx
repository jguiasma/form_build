import React from 'react';
import type { FormField } from '../../types/form-builder.types';

interface Props {
  field: FormField;
  updateField: (id: string | number, updates: Partial<FormField>) => void;
}

const BUTTON_STYLES = [
  { label: 'Primary', value: 'primary', preview: 'bg-[#1148ad] text-white' },
  { label: 'Secondary', value: 'secondary', preview: 'bg-slate-700 text-white' },
  { label: 'Outline', value: 'outline', preview: 'bg-white text-[#1148ad] border-2 border-[#1148ad]' },
];

const SubmitProperties: React.FC<Props> = ({ field, updateField }) => {
  const rules = field.validation_rules || {};

  const updateRule = (key: string, value: any) => {
    updateField(field.id!, {
      validation_rules: { ...rules, [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Button Text</label>
        <input
          type="text"
          value={field.label || 'Submit'}
          onChange={(e) => updateField(field.id!, { label: e.target.value })}
          placeholder="Submit"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black shadow-inner"
        />
      </div>

      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Button Style</label>
        <div className="space-y-2">
          {BUTTON_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => updateRule('button_style', style.value)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                (rules.button_style || 'primary') === style.value
                  ? 'border-[#1148ad] bg-blue-50 ring-2 ring-[#1148ad]/20'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${style.preview}`}>
                {field.label || 'Submit'}
              </div>
              <span className="text-[10px] font-black text-slate-600">{style.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Redirect URL (After Submit)</label>
        <input
          type="url"
          value={rules.redirect_url || ''}
          onChange={(e) => updateRule('redirect_url', e.target.value)}
          placeholder="https://example.com/thank-you"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold shadow-inner"
        />
        <p className="text-[9px] font-bold text-slate-400 mt-2 italic text-center">
          * Leave blank to show a default success message
        </p>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-[10px] font-black text-amber-600 leading-relaxed text-center">
          ⚠ The submit button cannot be deleted. It is always rendered as the last element of the last step.
        </p>
      </div>
    </div>
  );
};

export default SubmitProperties;
