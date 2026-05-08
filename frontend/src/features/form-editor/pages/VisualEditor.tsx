import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ArrowLeft, SparklesIcon, Eye, Send, ShieldIcon } from "lucide-react";

import { useFormEditorStore } from '../store/useFormEditorStore';
import { useGetForm, useUpdateFormSchema, usePublishForm } from '../hooks/useFormApi';
import ComponentPalette from '../components/ComponentPalette';
import FormCanvas from '../components/FormCanvas';
import PropertiesPanel from '../components/PropertiesPanel';
import StepManager from '../components/StepManager';
import FormPreview from '../components/FormPreview';
import PublishModal from '../components/PublishModal';

const VisualEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [showPreview, setShowPreview] = React.useState(false);
  const { data: formData, isLoading, isError, error } = useGetForm(id || '');
  const updateMutation = useUpdateFormSchema(id || '');
  const publishMutation = usePublishForm(id || '');

  const { schema, setSchema, activeStepId, updateFormDetails } = useFormEditorStore();
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);

  const [editingTitle, setEditingTitle] = React.useState(false);
  const [editingDesc, setEditingDesc] = React.useState(false);
  const [tempTitle, setTempTitle] = React.useState('');
  const [tempDesc, setTempDesc] = React.useState('');
  
  const [showPublishModal, setShowPublishModal] = React.useState(false);
  const [publishData, setPublishData] = React.useState<any>(null);

  useEffect(() => {
    if (!id) {
       navigate('/dashboard');
    }
  }, [id, navigate]);

  const [hasInitialized, setHasInitialized] = React.useState(false);

  useEffect(() => {
    setHasInitialized(false);
  }, [id]);

  useEffect(() => {
    if (formData && !hasInitialized) {
       setSchema(formData);
       setHasInitialized(true);
    }
  }, [formData, hasInitialized, setSchema]); 


  // Sync effect when schema changes
  useEffect(() => {
    if (schema.id && !isLoading) {
      const timeoutId = setTimeout(() => {
        updateMutation.mutate(schema, {
          onSuccess: () => setLastSavedAt(new Date())
        });
      }, 1000); // Debounce save
      return () => clearTimeout(timeoutId);
    }
  }, [schema, isLoading]);

  const handlePublish = async () => {
    try {
      const result = await publishMutation.mutateAsync();
      setPublishData(result);
      setShowPublishModal(true);
    } catch (e) {
      console.error('Publish failed', e);
    }
  };

  // Prevent accidental closing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (updateMutation.isPending) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [updateMutation.isPending]);

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[#f8fbfe] p-6 text-center">
        <p className="text-sm font-black text-rose-500 uppercase tracking-widest mb-3">
          Failed to initialize editor
        </p>
        <p className="text-sm text-slate-500 max-w-md">
          {(error as any)?.response?.data?.message || (error as Error)?.message || "The form could not be loaded."}
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-5 py-3 bg-[#1148ad] text-white rounded-xl text-sm font-bold"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  if (isLoading || !schema.id) return (
     <div className="flex flex-col justify-center items-center h-screen bg-[#f8fbfe]">
        <div className="size-16 border-4 border-[#1148ad]/20 border-t-[#1148ad] rounded-full animate-spin mb-4" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Initializing Editor...</p>
     </div>
  );

  const currentStepIndex = schema.steps.findIndex(s => s.id === activeStepId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-[#f8fbfe] font-['Inter'] text-slate-800 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 -ml-2 text-slate-400 hover:text-[#1148ad] hover:bg-blue-50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="size-8 bg-[#1148ad] rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                <span className="material-symbols-outlined text-white text-xl">dynamic_form</span>
              </div>
              <span className="font-black text-lg tracking-tight text-[#104aac]">AI FormFlow</span>
              <div className="ml-6 flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
                <div className={`size-1.5 rounded-full ${updateMutation.isPending ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {updateMutation.isPending ? 'Syncing...' : lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Draft'}
                </span>
                {updateMutation.isError && <span className="text-[10px] text-rose-500 font-bold ml-1">Sync Error!</span>}
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl px-8 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SparklesIcon className="w-4 h-4 text-blue-500" />
              </div>
              <input 
                type="text" 
                placeholder="Describe your form (e.g., 'A modern checkout form for a SaaS')..." 
                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1148ad]/30 focus:border-[#1148ad] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button 
              onClick={handlePublish}
              className="flex items-center gap-2 bg-[#1148ad] hover:bg-[#0033cc] text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md shadow-blue-500/20 disabled:opacity-50"
              disabled={publishMutation.isPending}
            >
              <Send className="w-4 h-4" /> {publishMutation.isPending ? 'Publishing...' : 'Publish'}
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <div className="size-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs ring-2 ring-white shadow-sm border border-amber-200">
              U
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar - Component Palette */}
          <ComponentPalette />

          {/* Center Canvas */}
          <main className="flex-1 bg-[#f1f5f9] overflow-y-auto custom-scrollbar p-8">
            <div className="max-w-3xl mx-auto">
              {/* Form Header / Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex-1 mr-4">
                    {editingTitle ? (
                      <input
                        autoFocus
                        type="text"
                        className="text-2xl font-black text-slate-900 tracking-tight bg-transparent border-b-2 border-[#1148ad] focus:outline-none w-full"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={() => {
                          setEditingTitle(false);
                          updateFormDetails(tempTitle, schema.description || '');
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                      />
                    ) : (
                      <h1 
                        onDoubleClick={() => { setTempTitle(schema.title); setEditingTitle(true); }}
                        className="text-2xl font-black text-slate-900 tracking-tight cursor-text hover:text-[#1148ad] transition-colors"
                        title="Double-click to edit"
                      >
                        {schema.title || 'Untitled Form'}
                      </h1>
                    )}

                    {editingDesc ? (
                      <input
                        autoFocus
                        type="text"
                        className="text-sm font-medium text-slate-500 mt-1 bg-transparent border-b border-slate-300 focus:outline-none w-full"
                        value={tempDesc}
                        onChange={(e) => setTempDesc(e.target.value)}
                        onBlur={() => {
                          setEditingDesc(false);
                          updateFormDetails(schema.title, tempDesc);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                      />
                    ) : (
                      <p 
                        onDoubleClick={() => { setTempDesc(schema.description || ''); setEditingDesc(true); }}
                        className="text-sm font-medium text-slate-500 mt-1 cursor-text hover:text-slate-800 transition-colors"
                        title="Double-click to edit description"
                      >
                        {schema.description || 'Add a description...'}
                      </p>
                    )}
                    
                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
                       Step {currentStepIndex + 1} of {Math.max(1, schema.steps.length)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-[#1148ad] tracking-widest uppercase">
                       {schema.steps.length ? Math.round(((currentStepIndex + 1) / schema.steps.length) * 100) : 0}% Complete
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-8">
                  <div className="bg-[#1148ad] h-1.5 rounded-full transition-all duration-300" style={{ width: `${schema.steps.length ? ((currentStepIndex + 1) / schema.steps.length) * 100 : 0}%` }}></div>
                </div>
              </div>

              <StepManager />

              {/* DropZone Canvas */}
              <FormCanvas />
              
              <div className="text-center mt-6 flex items-center justify-center gap-2 text-slate-400">
                <ShieldIcon className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">All data is encrypted and secure with 256-bit SSL</span>
              </div>
            </div>
          </main>

          {/* Right Sidebar - Field Configuration */}
          <PropertiesPanel />

        </div>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        `}</style>
      </div>
      {showPreview && <FormPreview onClose={() => setShowPreview(false)} />}
      <PublishModal 
        isOpen={showPublishModal} 
        onClose={() => setShowPublishModal(false)} 
        publishData={publishData}
      />
    </DndProvider>
  );
};

export default VisualEditor;
