import { CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export const PublicFormSuccess = () => (
  <div className="min-h-screen bg-[#f8fbfe] flex flex-col items-center justify-center p-4 text-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-500/10 border border-slate-100 max-w-lg w-full"
    >
      <div className="size-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-inner">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
        Submission Received!
      </h1>
      <p className="text-slate-500 mb-8 font-medium">
        Thank you for filling out the form. Your response has been securely saved.
      </p>
      <div className="pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Secure FormFlow Transmission
          </span>
        </div>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Powered by FormFlow AI
        </p>
      </div>
    </motion.div>
  </div>
);
