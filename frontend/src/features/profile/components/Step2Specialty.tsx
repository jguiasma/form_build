import React from "react";
import { Input } from "../../../shared/components/ui/input";
import { Button } from "../../../shared/components/ui/button";
import { Label } from "../../../shared/components/ui/label";
import { Briefcase, ArrowRight, ArrowLeft } from "lucide-react";

interface Step2Props {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isPending: boolean;
}

const specialties = [
  "Software Engineer",
  "Product Designer",
  "Product Manager",
  "Data Scientist",
  "Sales Representative",
  "HR Manager",
  "Founder / CEO",
  "Marketing Specialist",
  "Project Manager",
  "Operations Manager",
];

export const Step2Specialty: React.FC<Step2Props> = ({ value, onChange, onNext, onPrev, isPending }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
          <Briefcase className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">What's your specialty?</h2>
        <p className="text-slate-500 mt-2">What do you do best? This helps us customize your experience.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => onChange(spec)}
              className={`p-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                value === spec
                  ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                  : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        <FormDivider text="OR TYPE IT BELOW" />

        <div className="space-y-2">
          <Label htmlFor="specialty" className="text-sm font-semibold text-slate-700 ml-1">
            Other Specialty
          </Label>
          <Input
            id="specialty"
            placeholder="Type your specialty..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-14 px-5 bg-slate-50 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <Button
          onClick={onNext}
          disabled={!value || isPending}
          className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl shadow-lg shadow-blue-100 group"
        >
          <span>Continue</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button
          onClick={onPrev}
          variant="outline"
          className="w-full h-12 text-slate-500 border-none hover:bg-slate-50 font-semibold"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back to Name
        </Button>
      </div>
    </div>
  );
};

const FormDivider = ({ text }: { text: string }) => (
  <div className="relative my-4">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-slate-100"></span>
    </div>
    <div className="relative flex justify-center text-[10px] uppercase">
      <span className="bg-white px-3 text-slate-300 font-bold tracking-widest">
        {text}
      </span>
    </div>
  </div>
);
