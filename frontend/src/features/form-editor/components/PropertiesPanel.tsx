import React from 'react';
import { useFormEditorStore } from '../store/useFormEditorStore';
import { Settings, Mail, Type, Hash, Calendar, List, CircleDot, CheckSquare, FileUp, Send, AlignLeft, SlidersHorizontal, Table2, GitBranch } from 'lucide-react';
import EmailProperties from './properties/EmailProperties';
import TextProperties from './properties/TextProperties';
import TextareaProperties from './properties/TextareaProperties';
import NumberProperties from './properties/NumberProperties';
import DateProperties from './properties/DateProperties';
import FileProperties from './properties/FileProperties';
import SubmitProperties from './properties/SubmitProperties';
import OptionsManager from './properties/OptionsManager';
import { getConditionalLabels, getMatrixColumns, getMatrixRows, getSliderConfig } from '../lib/fieldConfig';

const TYPE_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  text:     { icon: <Type className="w-4 h-4" />,        color: 'bg-sky-500',     label: 'Text Input' },
  textarea: { icon: <AlignLeft className="w-4 h-4" />,   color: 'bg-teal-500',    label: 'Textarea' },
  email:    { icon: <Mail className="w-4 h-4" />,        color: 'bg-violet-500',  label: 'Email' },
  number:   { icon: <Hash className="w-4 h-4" />,        color: 'bg-amber-500',   label: 'Number' },
  date:     { icon: <Calendar className="w-4 h-4" />,    color: 'bg-emerald-500', label: 'Date Picker' },
  select:   { icon: <List className="w-4 h-4" />,        color: 'bg-indigo-500',  label: 'Dropdown Select' },
  radio:    { icon: <CircleDot className="w-4 h-4" />,   color: 'bg-pink-500',    label: 'Radio Group' },
  checkbox: { icon: <CheckSquare className="w-4 h-4" />, color: 'bg-orange-500',  label: 'Checkbox Group' },
  file:     { icon: <FileUp className="w-4 h-4" />,      color: 'bg-cyan-500',    label: 'File Upload' },
  submit:   { icon: <Send className="w-4 h-4" />,        color: 'bg-rose-500',    label: 'Submit Button' },
  slider:   { icon: <SlidersHorizontal className="w-4 h-4" />, color: 'bg-blue-500', label: 'Slider' },
  matrix:   { icon: <Table2 className="w-4 h-4" />,      color: 'bg-purple-500',  label: 'Matrix' },
  conditional: { icon: <GitBranch className="w-4 h-4" />, color: 'bg-lime-600', label: 'Conditional' },
};

const PropertiesPanel: React.FC = () => {
  const { schema, activeStepId, selectedFieldId, updateField } = useFormEditorStore();

  const step = schema.steps.find(s => s.id === activeStepId);
  const field = step?.fields.find(f => f.id === selectedFieldId);

  if (!field) {
    return (
      <aside className="w-[340px] bg-white border-l border-slate-200 flex flex-col shrink-0 items-center justify-center text-slate-400">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            <Settings className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400">Select a field to configure</p>
          <p className="text-[10px] text-slate-300 max-w-[180px] leading-relaxed">Click on any field in the canvas to view its type-specific properties here.</p>
        </div>
      </aside>
    );
  }

  const meta = TYPE_META[field.type] || TYPE_META.text;
  const isChoicesField = ['select', 'radio', 'checkbox'].includes(field.type);
  const isSubmit = field.type === 'submit';

  const renderTypeSpecificProperties = () => {
    switch (field.type) {
      case 'email':
        return <EmailProperties field={field} updateField={updateField} />;
      case 'text':
        return <TextProperties field={field} updateField={updateField} />;
      case 'textarea':
        return <TextareaProperties field={field} updateField={updateField} />;
      case 'number':
        return <NumberProperties field={field} updateField={updateField} />;
      case 'date':
        return <DateProperties field={field} updateField={updateField} />;
      case 'file':
        return <FileProperties field={field} updateField={updateField} />;
      case 'submit':
        return <SubmitProperties field={field} updateField={updateField} />;
      case 'slider': {
        const config = field.validation_rules?.slider_config || {};
        const sliderConfig = getSliderConfig(config);
        const updateSliderConfig = (updates: Record<string, any>) => updateField(field.id!, {
          validation_rules: {
            ...(field.validation_rules || {}),
            slider_config: { ...config, ...updates },
          },
        });

        return (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Mode</label>
              <select value={sliderConfig.mode} onChange={(e) => updateSliderConfig({ mode: e.target.value })} className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold">
                <option value="single">Single value</option>
                <option value="range">Range</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Min</label>
                <input type="number" value={sliderConfig.min} onChange={(e) => updateSliderConfig({ min: Number(e.target.value) })} className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Max</label>
                <input type="number" value={sliderConfig.max} onChange={(e) => updateSliderConfig({ max: Number(e.target.value) })} className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Step</label>
                <input type="number" value={sliderConfig.step} onChange={(e) => updateSliderConfig({ step: Number(e.target.value) })} className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Unit</label>
              <input value={sliderConfig.unit} onChange={(e) => updateSliderConfig({ unit: e.target.value })} placeholder="%, km, EUR..." className="w-full px-3 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Show Current Value</span>
              <input type="checkbox" checked={sliderConfig.showValue} onChange={(e) => updateSliderConfig({ show_value: e.target.checked })} className="w-5 h-5 text-[#1148ad] rounded-lg border-slate-300 focus:ring-[#1148ad] cursor-pointer" />
            </div>
          </div>
        );
      }
      case 'matrix': {
        const config = field.validation_rules?.matrix_config || {};
        const rows = getMatrixRows(config).join("\n");
        const columnsPreview = getMatrixColumns(config).join(", ");
        const updateMatrixConfig = (updates: Record<string, any>) => updateField(field.id!, {
          validation_rules: {
            ...(field.validation_rules || {}),
            matrix_config: { ...config, ...updates },
          },
        });

        return (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Scale Type</label>
              <select value={config.scale_type || "numeric"} onChange={(e) => updateMatrixConfig({ scale_type: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold">
                <option value="numeric">Numeric 1-5</option>
                <option value="numeric10">Numeric 1-10</option>
                <option value="stars">Stars</option>
                <option value="emoji">Emoji</option>
                <option value="text">Text labels</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Display</label>
              <select value={config.display || "radio"} onChange={(e) => updateMatrixConfig({ display: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold">
                <option value="radio">Radio buttons per row</option>
                <option value="slider">Slider per row</option>
              </select>
            </div>
            {config.scale_type === "text" && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Column Labels</label>
                <input value={config.text_labels || ""} onChange={(e) => updateMatrixConfig({ text_labels: e.target.value })} placeholder="Bad, Average, Good" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
              </div>
            )}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Rows</label>
              <textarea value={rows} onChange={(e) => updateMatrixConfig({ rows: e.target.value.split("\n").map(v => v.trim()).filter(Boolean) })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold min-h-[90px]" />
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resolved Columns</p>
              <p className="text-xs font-bold text-slate-600">{columnsPreview}</p>
            </div>
          </div>
        );
      }
      case 'conditional': {
        const config = field.validation_rules?.conditional_config || {};
        const preview = getConditionalLabels(config);
        const updateConditionalConfig = (updates: Record<string, any>) => updateField(field.id!, {
          validation_rules: {
            ...(field.validation_rules || {}),
            conditional_config: { ...config, ...updates },
          },
        });

        return (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Trigger Field Key</label>
              <input value={config.trigger_field_key || ""} onChange={(e) => updateConditionalConfig({ trigger_field_key: e.target.value })} placeholder="field_key" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Operator</label>
              <select value={config.operator || "equals"} onChange={(e) => updateConditionalConfig({ operator: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold">
                <option value="equals">Equals</option>
                <option value="not_equals">Not equals</option>
                <option value="contains">Contains</option>
                <option value="greater_than">Greater than</option>
                <option value="less_than">Less than</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Trigger Value</label>
              <input value={config.trigger_value || ""} onChange={(e) => updateConditionalConfig({ trigger_value: e.target.value })} placeholder="yes, true, 18..." className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Inner Type</label>
              <select value={config.inner_type || "text"} onChange={(e) => updateConditionalConfig({ inner_type: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold">
                {['text','textarea','number','email','select','radio','checkbox','date','file'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="rounded-xl bg-blue-50/60 border border-blue-100 px-4 py-3">
              <p className="text-[10px] font-black text-[#1148ad] uppercase tracking-widest mb-1">{preview.conditionLabel}</p>
              <p className="text-xs font-bold text-slate-600">{preview.actionLabel}</p>
            </div>
          </div>
        );
      }
      case 'select':
      case 'radio':
      case 'checkbox':
        return null; // Options are rendered separately below
      default:
        return null;
    }
  };

  return (
    <aside className="w-[340px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3 sticky top-0 bg-white z-10">
        <div className={`p-2.5 ${meta.color} rounded-xl text-white shadow-lg`}>
          {meta.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-black text-sm text-slate-900 leading-tight">{meta.label}</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">{field.type} Component</p>
        </div>
      </div>

      <div className="p-5 space-y-6 flex-1">

        {/* ── SECTION 1: Common Properties ── */}
        {!isSubmit && (
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-100"></div>
              General
              <div className="h-px flex-1 bg-slate-100"></div>
            </h4>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Label</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => updateField(field.id!, { label: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-800 focus:bg-white focus:border-[#1148ad]/30 focus:ring-2 focus:ring-[#1148ad]/10 transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Field Key</label>
              <input
                type="text"
                value={field.field_key}
                onChange={(e) => updateField(field.id!, { field_key: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-mono font-bold text-slate-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Placeholder – not for checkbox/radio/file/submit */}
            {!['checkbox', 'radio', 'file'].includes(field.type) && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(field.id!, { placeholder: e.target.value })}
                  placeholder={field.type === 'email' ? 'your@email.com' : 'Enter value...'}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white transition-all shadow-inner"
                />
              </div>
            )}

            {/* Help Text */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Help Text</label>
              <input
                type="text"
                value={field.description || ''}
                onChange={(e) => updateField(field.id!, { description: e.target.value })}
                placeholder="Appears below the field"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Custom Error Message */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block text-rose-500">Custom Error Message</label>
              <input
                type="text"
                value={field.custom_error_message || ''}
                onChange={(e) => updateField(field.id!, { custom_error_message: e.target.value })}
                placeholder="Shown when validation fails"
                className="w-full px-4 py-3 bg-rose-50/30 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white focus:border-rose-200 transition-all shadow-inner"
              />
            </div>

            {/* Default Value – not for file/checkbox */}
            {!['file', 'checkbox', 'radio', 'select'].includes(field.type) && (
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Default Value</label>
                <input
                  type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  value={field.default_value || ''}
                  onChange={(e) => updateField(field.id!, { default_value: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600 focus:bg-white transition-all shadow-inner"
                />
              </div>
            )}

            {/* Required Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex flex-col">
                <label className="text-[10px] font-black text-slate-800 cursor-pointer uppercase tracking-tight" htmlFor="is-req">Required Field</label>
                <span className="text-[9px] text-slate-400 font-medium">Validation will fail if empty</span>
              </div>
              <input
                id="is-req"
                type="checkbox"
                checked={field.is_required}
                onChange={(e) => updateField(field.id!, { is_required: e.target.checked })}
                className="w-5 h-5 text-[#1148ad] rounded-lg border-slate-300 focus:ring-[#1148ad] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ── SECTION 2: Type-Specific Properties ── */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="h-px flex-1 bg-slate-100"></div>
            {isSubmit ? 'Button Settings' : isChoicesField ? 'Choices & Rules' : 'Type Rules'}
            <div className="h-px flex-1 bg-slate-100"></div>
          </h4>

          {renderTypeSpecificProperties()}

          {/* Choices-based fields get OptionsManager + extra toggles */}
          {isChoicesField && (
            <div className="space-y-5">
              {/* Checkbox-specific toggles */}
              {field.type === 'checkbox' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black text-slate-800 uppercase tracking-tight" htmlFor="inline-toggle">Display Inline</label>
                      <span className="text-[9px] text-slate-400 font-medium">Horizontal layout</span>
                    </div>
                    <input
                      id="inline-toggle"
                      type="checkbox"
                      checked={field.validation_rules?.display_inline || false}
                      onChange={(e) => updateField(field.id!, {
                        validation_rules: { ...(field.validation_rules || {}), display_inline: e.target.checked }
                      })}
                      className="w-5 h-5 text-[#1148ad] rounded-lg border-slate-300 focus:ring-[#1148ad] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Select-specific toggle */}
              {field.type === 'select' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black text-slate-800 uppercase tracking-tight" htmlFor="multi-select">Multiple Select</label>
                      <span className="text-[9px] text-slate-400 font-medium">Allow selecting multiple values</span>
                    </div>
                    <input
                      id="multi-select"
                      type="checkbox"
                      checked={field.validation_rules?.multiple || false}
                      onChange={(e) => updateField(field.id!, {
                        validation_rules: { ...(field.validation_rules || {}), multiple: e.target.checked }
                      })}
                      className="w-5 h-5 text-[#1148ad] rounded-lg border-slate-300 focus:ring-[#1148ad] cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-black text-slate-800 uppercase tracking-tight" htmlFor="allow-empty">Allow Empty</label>
                      <span className="text-[9px] text-slate-400 font-medium">Show a blank first option</span>
                    </div>
                    <input
                      id="allow-empty"
                      type="checkbox"
                      checked={field.validation_rules?.allow_empty || false}
                      onChange={(e) => updateField(field.id!, {
                        validation_rules: { ...(field.validation_rules || {}), allow_empty: e.target.checked }
                      })}
                      className="w-5 h-5 text-[#1148ad] rounded-lg border-slate-300 focus:ring-[#1148ad] cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Options Manager */}
              <OptionsManager fieldId={field.id!} />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default PropertiesPanel;
