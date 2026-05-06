import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

type CreateFormModalProps = {
  isOpen: boolean;
  error: string | null;
  formDetails: {
    title: string;
    description: string;
    form_type_id: number;
  };
  formTypes?: any[];
  onChange: (details: { title: string; description: string; form_type_id: number }) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
};

export const CreateFormModal = ({
  isOpen,
  error,
  formDetails,
  formTypes,
  onChange,
  onClose,
  onSubmit,
}: CreateFormModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100">
          <div className="p-10">
            <h3 className="font-black text-2xl text-slate-900 mb-8">Create New Form</h3>
            {error && (
              <div className="mb-6 px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                <p className="text-sm font-bold text-rose-600">{error}</p>
              </div>
            )}
            <form onSubmit={onSubmit} className="space-y-6">
              <input type="text" required value={formDetails.title} onChange={(event) => onChange({ ...formDetails, title: event.target.value })} placeholder="Form Title" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" />
              <select value={formDetails.form_type_id} onChange={(event) => onChange({ ...formDetails, form_type_id: parseInt(event.target.value) })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none">
                {formTypes?.map((type: any) => <option key={type.id} value={type.id}>{type.name}</option>)}
              </select>
              <textarea rows={3} value={formDetails.description} onChange={(event) => onChange({ ...formDetails, description: event.target.value })} placeholder="Description" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none resize-none" />
              <div className="flex gap-4">
                <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-[#1148ad] text-white font-black rounded-2xl shadow-xl">Create Form</button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
