import React from "react";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Label } from "../../../shared/components/ui/label";
import { User, ArrowRight } from "lucide-react";

interface Step1Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  isPending: boolean;
}

export const Step1Name: React.FC<Step1Props> = ({ value, onChange, onNext, isPending }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">What's your name?</h2>
        <p className="text-slate-500 mt-2">Let's start by getting to know you better.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">
          Full Name
        </Label>
        <Input
          id="name"
          placeholder="e.g. John Doe"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg"
          autoFocus
        />
      </div>

      <Button
        onClick={onNext}
        disabled={!value || isPending}
        className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl shadow-lg shadow-blue-100 mt-4 group"
      >
        <span>Next Step</span>
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};
