import React, { useState } from 'react';
import FaceAuth from './FaceAuth';
import { useEnrollBiometrics, useVerifyBiometrics, useCheckBiometricEmail } from '../hooks/useBiometricApi';
import { ShieldCheck, UserPlus, Fingerprint, Mail, Lock, User, CheckCircle2, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BiometricGateProps {
  onVerified: (account: any, token: string, score: number) => void;
  formTitle: string;
}

const BiometricGate: React.FC<BiometricGateProps> = ({ onVerified, formTitle }) => {
  const [step, setStep] = useState<'identify' | 'signup' | 'face_auth'>('identify');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'enroll' | 'verify'>('verify');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [remainingTries, setRemainingTries] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const enrollMutation = useEnrollBiometrics();
  const verifyMutation = useVerifyBiometrics();
  const checkEmailMutation = useCheckBiometricEmail();

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setError(null);
    try {
      const res = await checkEmailMutation.mutateAsync(email);
      if (res.exists) {
        setStep('face_auth');
        setMode('verify');
      } else {
        setError('Email not found. Please sign up first to enroll your biometrics.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setStep('face_auth');
    setMode('enroll');
  };

  const handleFailure = (reason: string, attempts?: number) => {
      setError(reason);
      if (attempts !== undefined) {
          setRemainingTries(Math.max(0, 5 - attempts));
      }
      setStep('identify');
  };

  const handleCapture = async (embedding: number[]) => {
    setError(null);
    setIsVerifying(true);
    try {
      if (mode === 'enroll') {
        await enrollMutation.mutateAsync({ email, name, template: embedding });
        const res = await verifyMutation.mutateAsync({ email, embedding });
        onVerified(res.account, res.token, res.similarity);
      } else {
        const res = await verifyMutation.mutateAsync({ email, embedding });
        onVerified(res.account, res.token, res.similarity);
      }
    } catch (err: any) {
      console.error('Biometric action failed:', err);
      const msg = err.response?.data?.message || 'Verification failed. Face does not match.';
      const attempts = err.response?.data?.attempts;
      handleFailure(msg, attempts);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfe] flex items-center justify-center p-4 font-['Inter']">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="bg-[#1148ad] p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="size-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Identity Verification</h2>
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Required for: {formTitle}</p>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'identify' && (
              <motion.div 
                key="identify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="font-black text-slate-900 tracking-tight text-lg">Who are you?</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Please enter your email to proceed.</p>
                </div>

                {error && (
                   <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold max-w-[65%]">
                             <AlertCircle className="w-5 h-5 shrink-0" />
                             <span className="leading-tight">{error}</span>
                          </div>
                          {remainingTries !== null && remainingTries > 0 && (
                             <span className="px-2 py-1.5 bg-red-100 text-red-700 text-[10px] uppercase font-black tracking-widest rounded-md whitespace-nowrap border border-red-200">
                                Unverified • {remainingTries} tries left
                             </span>
                          )}
                          {remainingTries === 0 && (
                             <span className="px-2 py-1.5 bg-red-600 text-white text-[10px] uppercase font-black tracking-widest rounded-md whitespace-nowrap shadow-sm shadow-red-500/30">
                                Unverified • Blocked
                             </span>
                          )}
                      </div>
                   </div>
                )}

                <form onSubmit={handleIdentify} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="alex@example.com" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={checkEmailMutation.isPending}
                    className="w-full py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-[#0033cc] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {checkEmailMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Continue <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep('signup')}
                    className="w-full text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors py-2"
                  >
                    Don't have an account? Sign up
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'signup' && (
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="font-black text-slate-900 tracking-tight text-lg">Create Account</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Enroll your biometrics for secure signing.</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Alex Johnson" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="alex@example.com" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-[#0033cc] transition-all flex items-center justify-center gap-2"
                  >
                    Start Face Capture <Fingerprint className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setStep('identify')}
                    className="w-full text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors py-2"
                  >
                    Already have an account? Log in
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'face_auth' && (
              <motion.div 
                key="face_auth"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <FaceAuth 
                  mode={mode} 
                  email={email} 
                  onCapture={handleCapture}
                  onStatusChange={setStatusMessage}
                  onFailure={handleFailure}
                  isVerifying={isVerifying}
                />
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{statusMessage || 'Initializing...'}</p>
                    <button 
                      onClick={() => setStep('identify')}
                      className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-2"
                    >
                      Cancel & Go Back
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted Biometrics</span>
            </div>
            <p className="text-[9px] text-slate-400">Your data is processed locally and never leaves this device as an image.</p>
        </div>
      </div>
    </div>
  );
};

export default BiometricGate;

