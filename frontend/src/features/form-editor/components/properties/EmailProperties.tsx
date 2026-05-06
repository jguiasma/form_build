import React from 'react';
import { Mail } from 'lucide-react';
import type { FormField } from '../../types/form-builder.types';

interface Props {
  field: FormField;
  updateField: (id: string | number, updates: Partial<FormField>) => void;
}

const EmailProperties: React.FC<Props> = ({ field, updateField }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl space-y-3">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-violet-500 rounded-lg text-white">
             <Mail className="w-4 h-4" />
           </div>
           <span className="text-xs font-black text-violet-700 uppercase tracking-tight">Active Validation</span>
        </div>
        <p className="text-[10px] font-bold text-violet-600/80 leading-relaxed">
          This field enforces strict <span className="text-violet-900 font-extrabold">RFC 5322</span> email format validation.
          The user's input must contain an '@' symbol and a valid domain extension.
        </p>
      </div>

    </div>
  );
};

export default EmailProperties;

