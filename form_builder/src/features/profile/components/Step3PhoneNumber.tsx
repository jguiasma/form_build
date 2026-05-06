import React from "react";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Label } from "../../../shared/components/ui/label";
import { Phone, ArrowRight, ArrowLeft } from "lucide-react";

interface Step3Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isPending: boolean;
}

export const Step3PhoneNumber: React.FC<Step3Props> = ({ value, onChange, onNext, onPrev, isPending }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Reachability matters</h2>
        <p className="text-slate-500 mt-2">Enter your phone number so we can stay in touch.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1">
          Phone Number
        </Label>
        <Input
          id="phone"
          placeholder="e.g. +1 (555) 000-0000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <Button
          onClick={onNext}
          disabled={!value || isPending}
          className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl shadow-lg shadow-blue-100 group"
        >
          <span>One last step!</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button
          onClick={onPrev}
          variant="outline"
          className="w-full h-12 text-slate-500 border-none hover:bg-slate-50 font-semibold"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Specialty
        </Button>
      </div>
    </div>
  );
};

