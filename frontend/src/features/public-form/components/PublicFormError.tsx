import { AlertCircle } from "lucide-react";

export const PublicFormError = () => (
  <div className="min-h-screen bg-[#f8fbfe] flex flex-col items-center justify-center p-4 text-center">
    <div className="size-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
      <AlertCircle className="w-10 h-10" />
    </div>
    <h1 className="text-2xl font-black text-slate-900 mb-2">Form Not Found</h1>
    <p className="text-slate-500 max-w-md">
      This form may have been removed or is no longer accepting responses.
    </p>
  </div>
);
