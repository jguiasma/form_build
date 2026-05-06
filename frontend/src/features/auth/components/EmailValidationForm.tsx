import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { authSchema, type AuthFormValues } from "../lib/auth";
import { useAuthStore } from "../store/authStore";
import { useEmailValidation } from "../hooks/useEmailValidation";
import { useVerifyMagicCode } from "../hooks/useVerifyMagicCode";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import { Label } from "../../../shared/components/ui/label";
import { cn } from "../../../shared/lib/utils";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../shared/components/ui/input-otp";
import { Link  } from "react-router-dom";
import type { AuthView } from "../types/auth.types";
import { useTranslation } from "react-i18next";

const GoogleIcon = () => (
  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FormDivider = ({ text = "OR" }: { text?: string }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-slate-200"></span>
    </div>
    <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
      <span className="bg-[#f8fbfe] px-3 text-slate-400 font-bold tracking-widest whitespace-nowrap">
        {text}
      </span>
    </div>
  </div>
);

export const EmailValidationForm: React.FC = () => {
   const { t } = useTranslation();
  const { view, setView, resetForm,  error, successMessage, email: storeEmail, setEmail } = useAuthStore();
  const mutation = useEmailValidation();
  const verifyMutation = useVerifyMagicCode();
  const [otp, setOtp] = React.useState("");

  const [countdown, setCountdown] = React.useState(0);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    mode: "onBlur",
    defaultValues: {
      email: storeEmail,
    },
  });

  const lastSubmittedOtp = React.useRef("");

  React.useEffect(() => {
    if (otp.length === 6 && !verifyMutation.isPending && lastSubmittedOtp.current !== otp) {
      lastSubmittedOtp.current = otp;
      verifyMutation.mutate(otp);
    }
  }, [otp, verifyMutation]);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = (data: AuthFormValues) => {
    setEmail(data.email);
    mutation.mutate({ email: data.email, action: view as "login" | "signup" | "verification" });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (otp.length === 6 && !verifyMutation.isPending) {
    lastSubmittedOtp.current = otp;
    verifyMutation.mutate(otp);
  }
};

  const handleResend = () => {
    if (countdown === 0 && storeEmail) {
      mutation.mutate({ email: storeEmail, action: view as "login" | "signup" | "verification" });
      setCountdown(60);
    }
  };

  const handleViewChange = (newView: AuthView) => {
    reset({email: ""});
    setView(newView);
    setOtp("");
    lastSubmittedOtp.current = "";
  };

  const isPending = mutation.isPending || verifyMutation.isPending;

  return (
    <div className="min-h-screen w-full flex flex-col bg-white font-sans text-slate-900 overflow-hidden select-none relative">

      {/* Techy Background Elements from Hero */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Particles Simulation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 bg-blue-400/10 rounded-full blur-3xl animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />

      {/* Dynamic Header - Optimized for mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                AI FormFlow
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleViewChange(view === "login" ? "signup" : "login")}
                className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {view === "login" ? t("auth.create_account") : t("auth.sign_in")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full relative z-10 pt-24 pb-12">
        <div className="w-full max-w-[440px] bg-white border border-blue-100/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center relative overflow-hidden group">
          {/* Subtle top accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 opacity-50" />

          <div className="mb-8 relative">
            <div className="absolute -inset-4 bg-blue-50 rounded-full animate-pulse transition-transform group-hover:scale-110" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Views - Scaled typography */}
          {view === "verification" ? (
            <>
              <h1 className="text-3xl font-black tracking-tight mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                {t("auth.verify_title")} <span className="text-blue-600">{t("auth.verify_title_accent")}</span>
              </h1>
              <p className="text-[14px] sm:text-base text-slate-500 font-medium text-center mb-6 sm:mb-10 leading-relaxed max-w-[280px]">
                {t("auth.verify_subtitle")}
              </p>

              <div className="w-full flex flex-col items-center space-y-6 sm:space-y-8">
                {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg w-full text-center border border-red-100">{error}</p>}
                {successMessage && <p className="text-emerald-600 text-sm font-bold bg-emerald-50 p-3 rounded-lg w-full text-center border border-emerald-100">{successMessage}</p>}
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => {
                    // Filter only digits (removes spaces, dashes, letters)
                    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 6);
                    setOtp(cleaned);
                  }}
                  onPaste={(e) => {
                    // Handle paste explicitly
                    e.preventDefault();
                    const pasted = e.clipboardData.getData('text');
                    const cleaned = pasted.replace(/[^0-9]/g, '').slice(0, 6);
                    setOtp(cleaned);
                  }}
                  disabled={isPending}
                >
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-14 w-11 sm:h-16 sm:w-13 rounded-2xl border border-blue-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm text-2xl font-bold bg-gray-50/50 transition-all"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                <div className="flex items-center gap-1.5 text-[13px] sm:text-sm font-semibold">
                  <span className="text-slate-400">{t("auth.no_code")}</span>
                  <button
                    onClick={handleResend}
                    disabled={countdown > 0 || isPending}
                    className="text-[#104aac] hover:underline decoration-2 underline-offset-4 disabled:opacity-50 disabled:hover:no-underline"
                  >
                    {countdown > 0 ? t("auth.resend_countdown", { count: countdown }) : t("auth.resend")}
                  </button>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl shadow-lg shadow-blue-100"
                >
                  {t("auth.verify_button")}
                </Button>

                <div className="flex justify-center gap-6 sm:gap-8 text-[12px] sm:text-[13px] font-bold text-slate-400 pt-1 sm:pt-2">
                  <a href="#" className="hover:text-[#104aac] transition-colors">{t("footer.privacy")}</a>
                  <a href="#" className="hover:text-[#104aac] transition-colors">{t("footer.terms")}</a>
                </div>
              </div>
            </>
          ) : view === "login" ? (
            <>
              <h1 className="text-3xl font-black tracking-tight mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                {t("auth.welcome")} <span className="text-blue-600">AI FormFlow</span>
              </h1>
              <p className="text-base text-gray-500 font-medium text-center mb-10 leading-relaxed">
                {t("auth.login_subtitle")}
              </p>

              <div className="w-full space-y-4 sm:space-y-6">
                <Button variant="outline" type="button" className="w-full h-12 sm:h-14 text-[14px] sm:text-[16px] font-bold border-slate-200 rounded-xl sm:rounded-2xl">
                  <GoogleIcon />
                    {t("auth.continue_google")}
                </Button>

                <FormDivider text={t("auth.common")} />

                {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg w-full text-center border border-red-100">{error}</p>}
                {successMessage && <p className="text-emerald-600 text-sm font-bold bg-emerald-50 p-3 rounded-lg w-full text-center border border-emerald-100">{successMessage}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1">
                    <Input
                      placeholder={t("auth.email_placeholder_simple")}
                      className={cn(
                        "h-12 sm:h-14 px-4 sm:px-5 bg-slate-50/50 border-slate-200 rounded-xl sm:rounded-2xl text-[14px] sm:text-base",
                        errors.email && "border-red-400 bg-red-50/20"
                      )}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-[11px] font-bold text-red-600 ml-2 mt-0.5">{errors.email.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl shadow-lg shadow-blue-100">
                    {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : t("auth.send_magic_link")}
                  </Button>
                </form>

                <p className="text-center text-[11px] sm:text-[13px] font-medium text-slate-400 max-w-[280px] mx-auto leading-tight sm:leading-relaxed">
                  {t("auth.no_account")}{" "}
                  <button type="button" onClick={() => handleViewChange("signup")} className="text-blue-600 font-bold hover:underline cursor-pointer">
                    {t("auth.sign_up")}
                  </button>
                </p>

                <div className="flex justify-center gap-6 sm:gap-8 text-[12px] sm:text-[13px] font-bold text-slate-400 pt-2 sm:pt-4">
                  <a href="#" className="hover:text-[#104aac] transition-colors">{t("footer.privacy")}</a>
                  <a href="#" className="hover:text-[#104aac] transition-colors">{t("footer.terms")}</a>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-black tracking-tight mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                {t("auth.signup_title")} <span className="text-blue-600">AI FormFlow</span>
              </h1>
              <p className="text-base text-gray-500 font-medium text-center mb-10 leading-relaxed">
                {t("auth.signup_subtitle")}
              </p>

              <div className="w-full space-y-4 sm:space-y-6">
                {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg w-full text-center border border-red-100">{error}</p>}
                {successMessage && <p className="text-emerald-600 text-sm font-bold bg-emerald-50 p-3 rounded-lg w-full text-center border border-emerald-100">{successMessage}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 text-left">
                    <Label className="font-bold text-slate-700 ml-1 mb-1 sm:mb-2 inline-block text-[13px] sm:text-sm">{t("auth.email_label")}</Label>
                    <Input
                      placeholder={t("auth.email_placeholder")}
                      className={cn("h-12 sm:h-14 px-4 sm:px-5 bg-slate-50/50 border-slate-200 rounded-xl sm:rounded-2xl text-[14px] sm:text-base", errors.email && "border-red-400")}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-[11px] font-bold text-red-600 ml-2 mt-0.5">{errors.email.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isPending} className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all rounded-2xl shadow-lg shadow-blue-100">
                    {isPending ? <Loader2 className="animate-spin h-5 w-5" /> : t("auth.send_login_link")}
                  </Button>
                </form>

                <FormDivider text={t("auth.common")}  />

                <Button variant="outline" type="button" className="w-full h-12 sm:h-14 text-[14px] sm:text-[16px] font-bold border-slate-200 rounded-xl sm:rounded-2xl">
                  <GoogleIcon />
                  {t("auth.continue_google")}
                </Button>

                <div className="text-center space-y-4 sm:space-y-5 pt-2 sm:pt-4">
                  <p className="text-[12px] sm:text-[14px] font-semibold text-slate-500 leading-tight">
                    {t("auth.have_account")}{" "}
                    <button type="button" onClick={() => handleViewChange("login")} className="text-blue-600 font-bold hover:underline cursor-pointer">
                      {t("auth.log_in")}
                    </button>
                  </p>
                  <div className="flex justify-center gap-6 sm:gap-8 text-[12px] sm:text-[13px] font-bold text-slate-400">
                    <a href="#" className="hover:text-[#104aac] transition-colors">{t("footer.privacy")}</a>
                    <a href="#" className="hover:text-[#104aac] transition-colors">{t("footer.terms")}</a>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Style tag for custom animations matching hero */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
      `}</style>

      {/* Footer - Optimized for mobile layout */}
      <footer className="w-full py-4 px-8 border-t border-gray-100 bg-white/20 backdrop-blur-sm shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-bold text-gray-400">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
           {t("footer.status")}
        </div>
        <div className="flex items-center gap-6">
          <span>v2.4.0-stable</span>
          <span className="hidden xs:inline">© 2026 AI FormFlow</span>
        </div>
      </footer>
    </div>
  );
};

