import React from 'react';
import type { FormField } from '../../types/form-builder.types';

interface Props {
  field: FormField;
  updateField: (id: string | number, updates: Partial<FormField>) => void;
}

const MIME_PRESETS = [
  { label: 'Images', value: 'image/*', icon: '🖼️' },
  { label: 'PDF', value: 'application/pdf', icon: '📄' },
  { label: 'Documents', value: '.doc,.docx,.odt', icon: '📝' },
  { label: 'Spreadsheets', value: '.xls,.xlsx,.csv', icon: '📊' },
  { label: 'All Files', value: '*', icon: '📁' },
];

const FileProperties: React.FC<Props> = ({ field, updateField }) => {
  const rules = field.validation_rules || { allowed_types: ['image/*'], max_size_mb: 10 };

  const updateRule = (key: string, value: any) => {
    updateField(field.id!, {
      validation_rules: { ...rules, [key]: value }
    });
  };

  const toggleMime = (mime: string) => {
    const current: string[] = rules.allowed_types || [];
    if (mime === '*') {
      updateRule('allowed_types', ['*']);
      return;
    }
    const filtered = current.filter((m: string) => m !== '*');
    const newTypes = filtered.includes(mime)
      ? filtered.filter((m: string) => m !== mime)
      : [...filtered, mime];
    updateRule('allowed_types', newTypes.length > 0 ? newTypes : ['image/*']);
  };

  const currentTypes: string[] = rules.allowed_types || ['image/*'];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Allowed File Types</label>
        <div className="grid grid-cols-2 gap-2">
          {MIME_PRESETS.map((preset) => {
            const isActive = currentTypes.includes(preset.value) || currentTypes.includes('*');
            return (
              <button
                key={preset.value}
                onClick={() => toggleMime(preset.value)}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-[10px] font-black transition-all ${
                  isActive
                    ? 'bg-[#1148ad] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
          Max File Size: <span className="text-[#1148ad]">{rules.max_size_mb || 10} MB</span>
        </label>
        <input
          type="range"
          min={1}
          max={50}
          value={rules.max_size_mb || 10}
          onChange={(e) => updateRule('max_size_mb', Number(e.target.value))}
          className="w-full accent-[#1148ad]"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-bold text-slate-400">1 MB</span>
          <span className="text-[10px] font-bold text-slate-400">50 MB</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
        <div className="flex flex-col">
          <label className="text-[10px] font-black text-slate-800 uppercase tracking-tight" htmlFor="multi-files">
            Multiple Files
          </label>
          <span className="text-[9px] text-slate-400 font-medium">Allow uploading multiple files</span>
        </div>
        <input
          id="multi-files"
          type="checkbox"
          checked={rules.multiple || false}
          onChange={(e) => updateRule('multiple', e.target.checked)}
          className="w-5 h-5 text-[#1148ad] rounded-lg border-slate-300 focus:ring-[#1148ad] cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FileProperties;

