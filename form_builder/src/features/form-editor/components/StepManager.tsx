import React, { useState, useRef, useEffect } from 'react';
import { useFormEditorStore } from '../store/useFormEditorStore';
import { useUpdateStep, useDeleteStep } from '../hooks/useFormApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Check, X, AlertCircle, Trash2 } from 'lucide-react';

const StepManager: React.FC = () => {
  const { schema, activeStepId, setActiveStep, addStep, removeStep, reorderSteps, updateStep } = useFormEditorStore();
  const updateStepMutation = useUpdateStep(schema.id!);
  const deleteStepMutation = useDeleteStep(schema.id!);

  const [editingStepId, setEditingStepId] = useState<string | number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = (e: React.MouseEvent, step: any) => {
    e.stopPropagation();
    setEditingStepId(step.id);
    setEditValue(step.title);
  };

  const handleCancel = () => {
    setEditingStepId(null);
    setEditValue('');
  };

  const handleSave = async () => {
    if (!editingStepId) return;
    if (editValue.trim().length < 2 || editValue.trim().length > 100) return;

    const originalStep = schema.steps.find(s => s.id === editingStepId);
    if (!originalStep || originalStep.title === editValue) {
        setEditingStepId(null);
        return;
    }

    // Optimistic update
    const previousTitle = originalStep.title;
    updateStep(editingStepId, { title: editValue });
    setEditingStepId(null);

    // Backend sync
    if (typeof editingStepId === 'number') {
        try {
            await updateStepMutation.mutateAsync({ id: editingStepId, title: editValue });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            // Rollback on error
            updateStep(editingStepId, { title: previousTitle });
        }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const handleDeleteStep = async (e: React.MouseEvent, stepId: string | number) => {
    e.stopPropagation();
    
    const step = schema.steps.find(s => s.id === stepId);
    if (!step) return;

    // Safety check: Don't delete last step
    if (schema.steps.length <= 1) {
        alert("You must have at least one step in your form.");
        return;
    }

    if (step.fields.length > 0) {
        if (!confirm(`This step contains ${step.fields.length} fields. Are you sure you want to delete it?`)) {
            return;
        }
    }

    removeStep(stepId);

    if (typeof stepId === 'number') {
        try {
            await deleteStepMutation.mutateAsync(stepId);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            console.error("Failed to delete step:", error);
            // Ideally rollback local state here, but removeStep already happened.
            // For now, refresh would be needed if it failed critically.
        }
    }
  };

  useEffect(() => {
    if (editingStepId && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
    }
  }, [editingStepId]);

  return (
    <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar">
      {schema.steps.map((step, idx) => {
        const isActive = activeStepId === step.id;
        const isEditing = editingStepId === step.id;

        return (
          <div key={step.id} className="flex items-center gap-1 group relative">
            {isEditing ? (
              <div className="flex items-center gap-1 bg-white border border-[#1148ad] rounded-xl p-0.5 shadow-lg z-10">
                <input
                  ref={inputRef}
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={handleSave}
                  className="px-3 py-1.5 text-sm font-bold bg-transparent outline-none w-32 md:w-48 text-slate-800"
                  placeholder="Step title..."
                />
                <button 
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                  onClick={handleSave}
                  className="p-1 hover:text-emerald-500 text-slate-400 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button 
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleCancel}
                  className="p-1 hover:text-rose-500 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
                <div className="relative flex items-center gap-1">
                    <button
                        onClick={() => setActiveStep(step.id!)}
                        className={`px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all border flex items-center gap-2 group/btn ${
                        isActive
                            ? 'bg-[#1148ad] text-white border-[#1148ad] shadow-md shadow-blue-500/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-sm hover:border-slate-300'
                        }`}
                    >
                        <span>{step.title}</span>
                        <Edit2 
                          className={`w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity cursor-pointer h-full ${isActive ? 'text-white' : 'text-slate-500'}`} 
                          onClick={(e) => handleStartEdit(e, step)}
                        />
                    </button>
                    
                    {isActive && (
                        <div className="flex items-center gap-1 scale-75 opacity-70">
                            <button 
                                onClick={(e) => handleDeleteStep(e, step.id!)}
                                className="hover:text-rose-500 p-1"
                                title="Delete Step"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); reorderSteps(idx, idx - 1); }}
                                    disabled={idx === 0}
                                    className="hover:text-[#1148ad] disabled:opacity-30"
                                >
                                    <div className="material-symbols-outlined text-lg">expand_less</div>
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); reorderSteps(idx, idx + 1); }}
                                    disabled={idx === schema.steps.length - 1}
                                    className="hover:text-[#1148ad] disabled:opacity-30"
                                >
                                    <div className="material-symbols-outlined text-lg">expand_more</div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Validation Feedback */}
            {isEditing && (editValue.trim().length < 2 || editValue.trim().length > 100) && editValue.trim() !== '' && (
                <div className="absolute top-full left-0 mt-1 text-[10px] text-rose-500 font-bold bg-white px-2 py-1 rounded border border-rose-100 shadow-sm flex items-center gap-1 z-20">
                    <AlertCircle className="w-3 h-3" />
                    2-100 characters required
                </div>
            )}
          </div>
        );
      })}
      
      <div className="flex items-center gap-3">
        <button 
            onClick={addStep}
            className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap border-2 border-dashed border-slate-200 text-slate-400 hover:text-[#1148ad] hover:border-[#1148ad]/30 bg-white shadow-sm transition-all"
        >
            + Add Step
        </button>

        <AnimatePresence>
            {isSaved && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-[#1148ad] text-[10px] font-black uppercase tracking-widest bg-blue-50 px-3 py-2 rounded-lg"
                >
                    <div className="w-1.5 h-1.5 bg-[#1148ad] rounded-full animate-pulse" />
                    💾 Saved
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StepManager;

