import React, { useRef } from "react";
import { ArrowLeft, Check, Camera, Upload } from "lucide-react";

interface Step4AvatarProps {
  value: string;
  onChange: (avatar: string) => void;
  onPhotoChange: (file: File) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isPending: boolean;
  photo: File | null;
}

export const Step4Avatar: React.FC<Step4AvatarProps> = ({ 
  value, 
  onChange, 
  onPhotoChange,
  onSubmit, 
  onPrev, 
  isPending,
  photo
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Choose your avatar</h2>
        <p className="text-slate-500 font-medium">Pick a style that represents you or upload your own photo.</p>
      </div>

      <div className="space-y-6">
        {/* Photo Upload Option */}
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-3xl hover:border-blue-400 transition-colors group">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {photo ? (
            <div className="relative">
              <img 
                src={URL.createObjectURL(photo)} 
                alt="Upload preview" 
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                <Check className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <Camera className="w-10 h-10 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          )}

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            <Upload className="w-4 h-4" />
            {photo ? "Change Photo" : "Upload Photo"}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-black tracking-widest">Or choose a preset</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {avatars.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => onChange(avatar)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                value === avatar ? "border-blue-600 ring-4 ring-blue-50" : "border-slate-100 grayscale hover:grayscale-0"
              }`}
            >
              <img src={avatar} alt="Avatar option" className="w-full h-full object-cover" />
              {value === avatar && (
                <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                  <div className="bg-blue-600 text-white p-1 rounded-full shadow-lg">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={onPrev}
          disabled={isPending}
          className="flex-1 h-14 rounded-2xl border border-slate-200 text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={isPending || (!value && !photo)}
          className="flex-[2] h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </>
          ) : (
            "Complete & Start Building"
          )}
        </button>
      </div>
    </div>
  );
};
