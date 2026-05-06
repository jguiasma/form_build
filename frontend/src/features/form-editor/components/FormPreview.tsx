import React, { useState, useEffect, useRef } from 'react';
import { useFormEditorStore } from '../store/useFormEditorStore';
import { 
  Monitor, 
  Smartphone, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Star,
  Phone,
  Link,
  UploadCloud,
  CreditCard,
  Mic,
  PenTool,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { FormField } from '../types/form-builder.types';


interface FormPreviewProps {
  onClose: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ onClose }) => {
  const { schema } = useFormEditorStore();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string | number, any>>({});
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = schema.steps || [];
  const currentStep = steps[currentStepIndex];
  const progress = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 0;

  const handleInputChange = (fieldId: string | number, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const toggleChoice = (fieldId: string | number, value: any) => {
    setFormValues(prev => ({
        ...prev,
        [fieldId]: prev[fieldId] === value ? null : value
    }));
  };

  const handleScroll = () => {
    if (isDescExpanded) setIsDescExpanded(false);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
        el.addEventListener('scroll', handleScroll);
        return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [isDescExpanded]);

  const getFieldError = (field: FormField) => {
    const value = formValues[field.id!] ?? '';
    
    if (field.is_required && (value === '' || (Array.isArray(value) && value.length === 0))) {
        return field.custom_error_message || "This field is required";
    }

    if (!value) return null;

    if (field.type === 'email' && typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return field.custom_error_message || "Invalid email format";
    }

    if (field.type === 'number' && isNaN(Number(value))) {
        return field.custom_error_message || "Must be a valid number";
    }

    if (field.type === 'url' && typeof value === 'string' && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(value)) {
        return field.custom_error_message || "Invalid URL format";
    }

    return null;
  };

  const renderField = (field: FormField) => {
    const value = formValues[field.id!] || '';
    const isSelected = (val: any) => formValues[field.id!] === val;
    const error = getFieldError(field);

    const labelArea = (
        <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-700">
                {field.is_required && <span className="text-rose-500 mr-1">*</span>}
                {field.label}
            </label>
            {error && (
                <span className="text-[10px] font-bold text-rose-500">{error}</span>
            )}
        </div>
    );

    const inputClasses = `w-full px-4 py-3 bg-white border ${error ? 'border-rose-400 ring-4 ring-rose-50' : 'border-slate-200'} rounded-xl text-sm focus:outline-none focus:border-[#1148ad] focus:ring-4 focus:ring-blue-50/50 transition-all`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
      case 'url':
        return (
          <div key={field.id} className="space-y-1">
            {labelArea}
            <div className="relative">
                <input 
                    type={field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : field.type} 
                    value={value}
                    onChange={(e) => handleInputChange(field.id!, e.target.value)}
                    placeholder={field.placeholder || ''} 
                    className={inputClasses}
                />
                {field.type === 'email' && value && !value.includes('@') && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                )}
                {field.type === 'phone' && <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                {field.type === 'url' && <Link className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
            </div>
            {field.description && <p className="text-[10px] text-slate-400 italic mt-1">{field.description}</p>}
          </div>
        );
      case 'textarea':
        return (
            <div key={field.id} className="space-y-1">
              {labelArea}
              <textarea 
                value={value}
                onChange={(e) => handleInputChange(field.id!, e.target.value)}
                placeholder={field.placeholder || ''} 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1148ad] min-h-[100px] transition-all"
              />
              {field.description && <p className="text-[10px] text-slate-400 italic mt-1">{field.description}</p>}
            </div>
        );
      case 'select':
        return (
            <div key={field.id} className="space-y-1">
                {labelArea}
                <select 
                    value={value}
                    onChange={(e) => handleInputChange(field.id!, e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1148ad] appearance-none" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                >
                    <option value="">Select choice...</option>
                    {field.options?.map((opt: any) => (
                        <option key={opt.id} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {field.description && <p className="text-[10px] text-slate-400 italic mt-1">{field.description}</p>}
            </div>
        );
    
      case 'checkbox':
      case 'radio':
        return (
            <div key={field.id} className="space-y-3">
                {labelArea}
                <div className={`grid gap-3 ${viewMode === 'desktop' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {field.options?.map((opt: any) => (
                        <div 
                          key={opt.id} 
                          onClick={() => toggleChoice(field.id!, opt.value)}
                          className={`flex items-center gap-3 p-3 border rounded-xl transition-all cursor-pointer group ${isSelected(opt.value) ? 'bg-blue-50 border-blue-200' : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-blue-200'}`}
                        >
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected(opt.value) ? 'bg-[#1148ad] border-[#1148ad]' : 'bg-white border-slate-200 group-hover:border-blue-300'}`}>
                                {isSelected(opt.value) && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-xs font-bold ${isSelected(opt.value) ? 'text-[#1148ad]' : 'text-slate-600'}`}>{opt.label}</span>
                        </div>
                    ))}
                </div>
                {field.description && <p className="text-[10px] text-slate-400 italic mt-1">{field.description}</p>}
            </div>
        );
      case 'date':
        return (
            <div key={field.id} className="space-y-1">
                {labelArea}
                <div className="relative">
                    <input 
                        type="date" 
                        value={value}
                        onChange={(e) => handleInputChange(field.id!, e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1148ad] transition-all"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
            </div>
        );
      case 'rating':
        return (
            <div key={field.id} className="space-y-2">
                {labelArea}
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star 
                            key={i} 
                            onClick={() => handleInputChange(field.id!, i)}
                            className={`w-6 h-6 cursor-pointer transition-colors ${i <= (value || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 hover:text-amber-200'}`} 
                        />
                    ))}
                </div>
            </div>
        );
      case 'grouped':
        return (
          <div key={field.id} className="space-y-3">
            {labelArea}
            {/* Rue */}
            <input 
              type="text" 
              placeholder="Rue" 
              value={value?.rue || ''}
              onChange={(e) => handleInputChange(field.id!, { ...value, rue: e.target.value })}
              className={inputClasses} 
            />
            {/* Ville + Code postal */}
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Ville" 
                value={value?.ville || ''}
                onChange={(e) => handleInputChange(field.id!, { ...value, ville: e.target.value })}
                className={inputClasses} 
              />
              <input 
                type="text" 
                placeholder="Code postal" 
                value={value?.zip || ''}
                onChange={(e) => handleInputChange(field.id!, { ...value, zip: e.target.value })}
                className={inputClasses} 
              />
            </div>
          </div>
        );
      case 'location':
        return (
            <div key={field.id} className="space-y-1">
                {labelArea}
                <div className="relative">
                    <input 
                        type="text" 
                        value={value}
                        onChange={(e) => handleInputChange(field.id!, e.target.value)}
                        placeholder="Search for address..." 
                        className="w-full px-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1148ad] transition-all"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1148ad]" />
                </div>
            </div>
        );
      case 'file':
        return (
            <div key={field.id} className="space-y-2">
                {labelArea}
                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-[#1148ad]" />
                    <span className="text-xs font-bold text-slate-500">Click to upload or drag and drop</span>
                    <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Max 10MB)</span>
                </div>
            </div>
        );
      case 'signature':
        return (
            <div key={field.id} className="space-y-2">
                {labelArea}
                <div className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl relative flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-300 absolute bottom-3">Sign Here</span>
                </div>
            </div >
        );
      case 'payment':
        return (
            <div key={field.id} className="space-y-2">
                {labelArea}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Secure Payment Form</span>
                    </div>
                    <div className="flex gap-1.5 grayscale opacity-50">
                        <div className="w-8 h-5 bg-slate-200 rounded" />
                        <div className="w-8 h-5 bg-slate-200 rounded" />
                    </div>
                </div>
            </div>
        );
      case 'voice':
        return (
            <div key={field.id} className="space-y-2">
                {labelArea}
                <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl">
                    <button className="size-10 bg-[#1148ad] rounded-full flex items-center justify-center text-white shadow-lg">
                        <Mic className="w-5 h-5" />
                    </button>
                    <div className="flex-1 space-y-1">
                        <div className="h-1 bg-slate-100 rounded-full w-full relative">
                            <div className="absolute top-0 left-0 w-1/3 h-full bg-[#1148ad] rounded-full" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voice Note Record</span>
                    </div>
                </div>
            </div>
        );
      case 'divider':
        return <hr key={field.id} className="border-t border-slate-100 my-6" />;
      case 'spacer':
        return <div key={field.id} className="h-4" />;
      case 'submit':
        return (
            <div key={field.id} className="pt-4">
                <button className="w-full py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    {field.label || 'Submit Form'}
                </button>
            </div>
        );
      default:
        return (
          <div key={field.id} className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
              <Info className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-700">Preview not available for {field.type}</span>
          </div>
        );
    }
  };

  const processRows = () => {
    if (!currentStep) return [];
    const rowMap = new Map<number, FormField[]>();
    currentStep.fields.forEach((field) => {
        const order = field.field_order || 0;
        if (!rowMap.has(order)) rowMap.set(order, []);
        rowMap.get(order)!.push(field);
    });
    
    return Array.from(rowMap.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([_, fields]) => fields.sort((a, b) => (a.column_index || 0) - (b.column_index || 0)));
  };

  const rows = processRows();

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8fbfe] flex flex-col overflow-hidden font-['Inter']">
      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0 shadow-sm relative z-20">
        <div className="flex items-center gap-3">
            <div className="size-8 bg-[#1148ad] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
                <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-0.5">FormFlow AI</h1>
                <p className="text-[10px] font-bold text-[#1148ad] uppercase tracking-widest">Enterprise</p>
            </div>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-xl scale-90">
            <button 
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'desktop' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Monitor className="w-4 h-4" /> Desktop
            </button>
            <button 
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'mobile' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Smartphone className="w-4 h-4" /> Mobile
            </button>
        </div>

        <div className="flex items-center gap-6">
            <button 
                onClick={onClose}
                className="flex items-center gap-2 bg-[#1148ad] text-white px-5 py-2.5 rounded-lg text-xs font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
                <X className="w-4 h-4" /> Exit Preview
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto relative bg-[#f8fbfe] py-12 px-4" onScroll={handleScroll}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1148ad 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 rounded-full shadow-sm">
            <div className="size-1.5 bg-[#1148ad] rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-[#1148ad] uppercase tracking-widest">Live Preview Mode</span>
        </div>

        <div className="max-w-7xl mx-auto h-full flex justify-center">
            <motion.div 
                layout
                className={`relative bg-white shadow-[0_32px_64px_-16px_rgba(16,24,40,0.12)] border border-slate-100 overflow-hidden transition-all duration-500 ${viewMode === 'desktop' ? 'w-full max-w-2xl rounded-3xl' : 'w-full max-w-[375px] rounded-[3rem] border-[8px] border-slate-900 shadow-2xl h-[700px]'}`}
            >
                <div 
                    ref={scrollRef}
                    className={`flex flex-col h-full bg-white ${viewMode === 'mobile' ? 'm-2 rounded-[2rem] overflow-y-auto' : ''}`}
                >
                    <div className={`${viewMode === 'mobile' ? 'min-h-[140px]' : 'h-40'} shrink-0 bg-[#f1f5f9] relative overflow-hidden flex flex-col items-center justify-center p-8 text-center border-b border-slate-50`}>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/micro-fabrics.png")' }}></div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight relative z-10 break-words max-w-full">{schema.title || 'Professional Profile & Preferences'}</h2>
                        
                        <div className="relative z-10 mt-2 max-w-full group">
                            <p 
                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                                className={`text-xs font-bold text-slate-400 transition-all duration-300 cursor-pointer ${isDescExpanded ? 'max-h-[300px] overflow-visible' : 'max-h-8 line-clamp-2'}`}
                            >
                                {schema.description || 'Tailor your experience within the ecosystem'}
                                {!isDescExpanded && (schema.description?.length > 80) && <span className="text-[#1148ad] ml-1">...</span>}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 p-8 space-y-8 overflow-y-auto custom-scrollbar">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-[#1148ad] uppercase tracking-[0.2em]">Step {currentStepIndex + 1} of {steps.length || 1}</span>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{progress}% Complete</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-[#1148ad] rounded-full shadow-[0_0_8px_rgba(17,72,173,0.3)]"
                                />
                            </div>
                            {currentStep && (
                                <h3 className="text-sm font-black text-slate-800 tracking-tight pt-2">{currentStep.title}</h3>
                            )}
                        </div>

                        <div className="space-y-8">
                             {rows.map((rowFields, idx) => (
                                 <div 
                                    key={idx} 
                                    className={`grid gap-6 ${viewMode === 'desktop' ? '' : 'grid-cols-1 !gap-8'}`} 
                                    style={viewMode === 'desktop' ? { gridTemplateColumns: `repeat(${rowFields.length}, minmax(0, 1fr))` } : {}}
                                 >
                                     {rowFields.map(field => renderField(field))}
                                 </div>
                             ))}
                        </div>

                        <div className="pt-6 flex gap-3">
                            {currentStepIndex > 0 && (
                                <button 
                                    onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                                    className="flex items-center justify-center p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all font-black text-sm"
                                    title="Back"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <button 
                                onClick={() => currentStepIndex < steps.length - 1 && setCurrentStepIndex(currentStepIndex + 1)}
                                className="flex-1 py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-[0_12px_24px_-4px_rgba(17,72,173,0.35)] flex items-center justify-center gap-2 hover:bg-[#0033cc] hover:-translate-y-0.5 transition-all"
                            >
                                {currentStepIndex < steps.length - 1 ? (
                                    <>Proceed to Step {currentStepIndex + 2} <ChevronRight className="w-4 h-4" /></>
                                ) : 'Complete Submission'}
                            </button>
                        </div>
                    </div>

                    <footer className="shrink-0 p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Secure Enterprise Cloud</span>
                        </div>
                        <div className="text-slate-400">
                             <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Powered by </span>
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">FormFlow AI</span>
                        </div>
                    </footer>
                </div>
            </motion.div>
        </div>

        <div className="fixed bottom-8 right-8 size-12 bg-white rounded-full shadow-2xl flex items-center justify-center text-slate-500 hover:text-[#1148ad] transition-all cursor-pointer border border-slate-100">
            <HelpCircle className="w-6 h-6" />
        </div>
      </main>
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default FormPreview;

