import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
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
  Info,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetPublicForm, useStartForm, useSaveAnswers, useSubmitFormResponse } from '../../form-editor/hooks/useFormApi';
import type { FormField } from '../../form-editor/types/form-builder.types';
import BiometricGate from '../../biometrics/components/BiometricGate';

const PublicForm: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: schema, isLoading, isError } = useGetPublicForm(uuid || '');
  
  const [isBiometricallyVerified, setIsBiometricallyVerified] = useState(false);
  const [biometricScore, setBiometricScore] = useState<number | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string | number, any>>({});
  const [responseId, setResponseId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string | number, string>>({});

  const startMutation = useStartForm(schema?.id || '');
  const saveAnswersMutation = useSaveAnswers(schema?.id || '', schema?.steps[currentStepIndex]?.id || '');
  const submitMutation = useSubmitFormResponse(schema?.id || '');

  useEffect(() => {
    if (schema?.id && !responseId) {
        // If biometrics required, wait for verification
        if (schema.require_biometrics && !isBiometricallyVerified) return;

        startMutation.mutate({
            biometric_verified: isBiometricallyVerified,
            biometric_score: biometricScore
        } as any, {
            onSuccess: (res) => {
                setResponseId(res.response_id);
            }
        });
    }
  }, [schema?.id, isBiometricallyVerified, responseId, schema?.require_biometrics]);

  const steps = schema?.steps || [];
  const currentStep = steps[currentStepIndex];
  const progress = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 0;

  const validateField = (field: FormField, val: any) => {
    if (field.is_required) {
      if (field.type === 'grouped') {
        if (!val?.rue || !val?.ville || !val?.zip) return "Please complete all address fields";
      } else if (val === '' || val === null || val === undefined || (Array.isArray(val) && val.length === 0)) {
        return field.custom_error_message || "This field is required";
      }
    }
    
    if (val && typeof val === 'string') {
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Invalid email address";
      if (field.type === 'url' && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(val)) return "Invalid URL";
      if (field.type === 'number' && isNaN(Number(val))) return "Must be a number";
    }
    return null;
  };

  const handleInputChange = (fieldId: string | number, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
    
    // Real-time validation
    const field = steps.flatMap(s => s.fields).find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => {
        const next = { ...prev };
        if (error) next[fieldId] = error;
        else delete next[fieldId];
        return next;
      });
    }
  };

  const toggleChoice = (fieldId: string | number, value: any) => {
    const newValue = formValues[fieldId] === value ? null : value;
    setFormValues(prev => ({
        ...prev,
        [fieldId]: newValue
    }));

    // Real-time validation
    const field = steps.flatMap(s => s.fields).find(f => f.id === fieldId);
    if (field) {
      const error = validateField(field, newValue);
      setErrors(prev => {
        const next = { ...prev };
        if (error) next[fieldId] = error;
        else delete next[fieldId];
        return next;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string | number, string> = {};
    let isValid = true;

    currentStep?.fields.forEach(field => {
        const value = formValues[field.id!] ?? '';
        
        // Required check
        if (field.is_required) {
            if (field.type === 'grouped') {
                if (!value.rue || !value.ville || !value.zip) {
                    newErrors[field.id!] = "Please complete all address fields";
                    isValid = false;
                }
            } else if (value === '' || (Array.isArray(value) && value.length === 0)) {
                newErrors[field.id!] = field.custom_error_message || "This field is required";
                isValid = false;
            }
        }

        // Format checks
        if (value && typeof value === 'string') {
            if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors[field.id!] = "Please enter a valid email address";
                isValid = false;
            }
            if (field.type === 'url' && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(value)) {
                newErrors[field.id!] = "Please enter a valid URL";
                isValid = false;
            }
            if (field.type === 'number' && isNaN(Number(value))) {
                newErrors[field.id!] = "Please enter a valid number";
                isValid = false;
            }
        }
    });

    setErrors(newErrors);
    
    if (!isValid) {
        // Scroll to first error
        const firstErrorId = Object.keys(newErrors)[0];
        const element = document.getElementById(`field-${firstErrorId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    // Save answers for current step
    const answersToSave = currentStep?.fields
        .filter(field => formValues[field.id!] !== undefined)
        .map(field => ({
            field_id: field.id,
            value: typeof formValues[field.id!] === 'object' ? JSON.stringify(formValues[field.id!]) : String(formValues[field.id!])
        }));

    if (answersToSave && answersToSave.length > 0 && responseId) {
        try {
            await saveAnswersMutation.mutateAsync({ 
                response_id: responseId, 
                answers: answersToSave 
            });
        } catch (e) {
            console.error('Failed to save answers', e);
        }
    }

    if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!responseId) return;
    
    // Final validation of all required fields in all steps
    // (Optional, but good for UX)
    
    setSubmitting(true);
    try {
        // Map all current values to their field keys for backend validation
        const payload: Record<string, any> = {
            response_id: responseId
        };
        
        steps.forEach(step => {
            step.fields.forEach(field => {
                if (formValues[field.id!] !== undefined) {
                    payload[field.field_key] = formValues[field.id!];
                }
            });
        });

        await submitMutation.mutateAsync(payload as any);
        setIsSubmitted(true);
    } catch (e: any) {
        console.error('Submission failed', e);
        if (e.response?.status === 422) {
            const serverErrors = e.response.data.errors;
            // Map server errors back to field IDs if possible
            const mappedErrors: Record<string | number, string> = {};
            steps.forEach(step => {
                step.fields.forEach(field => {
                    if (serverErrors[field.field_key]) {
                        mappedErrors[field.id!] = serverErrors[field.field_key][0];
                    }
                });
            });
            setErrors(mappedErrors);
            
            // Navigate to the first step with an error
            const firstErrorFieldId = Object.keys(mappedErrors)[0];
            const errorStepIndex = steps.findIndex(step => 
                step.fields.some(f => String(f.id) === firstErrorFieldId)
            );
            if (errorStepIndex !== -1) {
                setCurrentStepIndex(errorStepIndex);
            }
        }
    } finally {
        setSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8fbfe] flex flex-col items-center justify-center">
        <div className="size-16 border-4 border-[#1148ad]/20 border-t-[#1148ad] rounded-full animate-spin mb-4" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Form...</p>
    </div>
  );

  if (isError || !schema) return (
    <div className="min-h-screen bg-[#f8fbfe] flex flex-col items-center justify-center p-4 text-center">
        <div className="size-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
            <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Form Not Found</h1>
        <p className="text-slate-500 max-w-md">This form may have been removed or is no longer accepting responses.</p>
    </div>
  );

  if (schema.require_biometrics && !isBiometricallyVerified) {
    return (
      <BiometricGate 
        formTitle={schema.title} 
        onVerified={(account, token, score) => {
            // Save token in sessionStorage to prevent collision with Admin session in localStorage
            sessionStorage.setItem('biometric_auth_token', token);
            setBiometricScore(score);
            setIsBiometricallyVerified(true);
        }} 
      />
    );
  }

  if (isSubmitted) return (
    <div className="min-h-screen bg-[#f8fbfe] flex flex-col items-center justify-center p-4 text-center">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-500/10 border border-slate-100 max-w-lg w-full"
        >
            <div className="size-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Submission Received!</h1>
            <p className="text-slate-500 mb-8 font-medium">Thank you for filling out the form. Your response has been securely saved.</p>
            <div className="pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure FormFlow Transmission</span>
                </div>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">Powered by FormFlow AI</p>
            </div>
        </motion.div>
    </div>
  );

  const renderField = (field: FormField) => {
    const value = formValues[field.id!] || '';
    const isSelected = (val: any) => formValues[field.id!] === val;
    const error = errors[field.id!];

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
            </div>
        );
      case 'checkbox':
      case 'radio':
        return (
            <div key={field.id} className="space-y-3">
                {labelArea}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      case 'submit':
        return (
            <div key={field.id} className="pt-4">
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {field.label || 'Submit Form'}
                </button>
            </div>
        );
      default:
        return null;
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
    <div className="min-h-screen bg-[#f8fbfe] font-['Inter'] selection:bg-blue-100 selection:text-[#1148ad]">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1148ad 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-2xl mx-auto py-12 px-4 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(16,24,40,0.12)] border border-slate-100 overflow-hidden"
        >
            {/* Header */}
            <div className="bg-[#f1f5f9] p-8 sm:p-12 text-center relative overflow-hidden border-b border-slate-50">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/micro-fabrics.png")' }}></div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight relative z-10">{schema.title}</h1>
                {schema.description && (
                    <p className="text-sm font-bold text-slate-400 mt-4 relative z-10 max-w-lg mx-auto leading-relaxed">
                        {schema.description}
                    </p>
                )}
            </div>

            {/* Content */}
            <div className="p-8 sm:p-12 space-y-8">
                {/* Progress */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-[#1148ad] uppercase tracking-[0.2em]">Step {currentStepIndex + 1} of {steps.length}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{progress}% Complete</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-[#1148ad] rounded-full"
                        />
                    </div>
                    {currentStep && (
                        <h2 className="text-sm font-black text-slate-800 tracking-tight pt-2">{currentStep.title}</h2>
                    )}
                </div>

                {/* Fields */}
                <div className="space-y-8">
                    {steps.length === 0 ? (
                        <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                            <Info className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                            <p className="text-sm font-bold text-slate-400">This form doesn't have any steps or fields yet.</p>
                        </div>
                    ) : (
                        rows.map((rowFields, idx) => (
                            <div 
                                key={idx} 
                                className="grid gap-6" 
                                style={{ gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))` }}
                            >
                                {rowFields.map(field => (
                                    <div key={field.id} id={`field-${field.id}`}>
                                        {renderField(field)}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Actions */}
                <div className="pt-8 flex gap-4">
                    {currentStepIndex > 0 && (
                        <button 
                            onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                            className="flex items-center justify-center p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all font-black text-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <button 
                        onClick={handleNext}
                        disabled={submitting}
                        className="flex-1 py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-[0_12px_24px_-4px_rgba(17,72,173,0.35)] flex items-center justify-center gap-2 hover:bg-[#0033cc] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {submitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : currentStepIndex < steps.length - 1 ? (
                            <>Next Step <ChevronRight className="w-4 h-4" /></>
                        ) : (
                            <>Submit Form <Send className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>

            {/* Form Footer */}
            <footer className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">256-bit SSL Secure</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Powered by</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">FormFlow AI</span>
                </div>
            </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicForm;

