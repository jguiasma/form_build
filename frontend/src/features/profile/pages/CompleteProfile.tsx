import React from "react";
import { useProfileProgress } from "../hooks/useProfileProgress";
import { Step1Name } from "../components/Step1Name";
import { Step2Specialty } from "../components/Step2Specialty";
import { Step3PhoneNumber } from "../components/Step3PhoneNumber";
import { Step4Avatar } from "../components/Step4Avatar";
import { Link } from "react-router-dom";

const CompleteProfile: React.FC = () => {
  const {
    step,
    formData,
    setFormData,
    nextStep,
    prevStep,
    completeRegistrationMutation,
  } = useProfileProgress();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Name
            value={formData.name}
            onChange={(name) => setFormData({ ...formData, name })}
            onNext={nextStep}
            isPending={false}
          />
        );
      case 2:
        return (
          <Step2Specialty
            value={formData.specialty}
            onChange={(specialty) => setFormData({ ...formData, specialty })}
            onNext={nextStep}
            onPrev={prevStep}
            isPending={false}
          />
        );
      case 3:
        return (
          <Step3PhoneNumber
            value={formData.phone_number}
            onChange={(phone_number) => setFormData({ ...formData, phone_number })}
            onNext={nextStep}
            onPrev={prevStep}
            isPending={false}
          />
        );
      case 4:
        return (
          <Step4Avatar
            value={formData.avatar}
            onChange={(avatar) => setFormData({ ...formData, avatar, photo: null })}
            onPhotoChange={(file) => setFormData({ ...formData, photo: file, avatar: "" })}
            onSubmit={() => completeRegistrationMutation.mutate()}
            onPrev={prevStep}
            isPending={completeRegistrationMutation.isPending}
            photo={formData.photo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white font-sans text-slate-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                AI FormFlow
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-24 pb-12">
        <div className="w-full max-w-[480px] bg-white border border-blue-100/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-slate-50">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center mb-10 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <span>Step {step} of 4</span>
            <span className="text-blue-600">{Math.round((step / 4) * 100)}% Complete</span>
          </div>

          {renderStep()}

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-8 bg-blue-600" : s < step ? "w-4 bg-blue-300" : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full py-6 px-12 border-t border-gray-100 bg-white/20 backdrop-blur-sm shrink-0 flex justify-between items-center text-xs font-bold text-gray-400">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
          Secure Connection
        </div>
        <div>© 2026 AI FormFlow</div>
      </footer>
    </div>
  );
};

export default CompleteProfile;
