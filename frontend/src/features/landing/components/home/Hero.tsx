import { ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../auth/store/authStore";

export const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setView, clearAlerts } = useAuthStore();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#0A192F]">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              AI Form Builder
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              {t("hero.title")}<br />
              <span className="text-blue-500">{t("hero.title_accent")}</span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/auth" 
                onClick={() => {
                  clearAlerts();
                  setView("login");
                }}
                className="bg-white text-[#0A192F] px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-lg"
              >
                {t("hero.cta_primary")}
              </Link>
              <button 
                onClick={() => {
                  clearAlerts();
                  setView("login");
                  navigate("/auth");
                }}
                className="bg-transparent text-white border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-lg ring-1 ring-white/10"
              >
               {t("hero.cta_secondary")}
              </button>
            </div>
          </div>

        <div className="relative w-full max-w-2xl mx-auto perspective-1000">
  {/* Main Canvas Container */}
  <div className="relative bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#1a3a5c] rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-900/30 overflow-hidden">
    
    {/* Animated Background Grid */}
    <div className="absolute inset-0 opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }} />
    </div>

    {/* Floating Particles */}
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-blue-400/40 rounded-full animate-float"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${4 + Math.random() * 3}s`
        }}
      />
    ))}

    {/* Window Controls */}
    <div className="flex items-center gap-2 p-4 border-b border-white/10">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer" />
        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer" />
      </div>
      <div className="ml-4 text-xs text-blue-300/70 font-mono">form-builder.canvas</div>
    </div>

    {/* Builder Canvas */}
    <div className="p-6 space-y-4">
      
      {/* Toolbar - Draggable Components */}
      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
        {['Text', 'Email', 'Date', 'Select'].map((tool, idx) => (
          <div
            key={tool}
            className="group relative px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                      border border-blue-400/30 rounded-lg text-xs font-medium text-blue-200
                      hover:from-blue-600/40 hover:to-purple-600/40 hover:border-blue-300/50
                      hover:scale-105 transition-all duration-200 cursor-grab active:cursor-grabbing"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {tool}
            {/* Drag handle indicator */}
            <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Form Preview Area */}
      <div className="relative bg-[#0A192F]/80 rounded-2xl border border-blue-500/20 p-5 space-y-4 min-h-[200px]">
        
        {/* Animated Drop Zone Indicator */}
        <div className="absolute inset-0 border-2 border-dashed border-blue-400/30 rounded-2xl 
                      animate-pulse-slow pointer-events-none" />

        {/* Form Fields - Assembling Animation */}
        <div className="space-y-3">
          {/* Email Field - Slides in */}
          <div className="group animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <label className="block text-xs font-medium text-blue-300 mb-1.5">{t("hero.field_email")}</label>
            <div className="relative">
              <input
                type="email"
                disabled
                placeholder={t("hero.field_email_placeholder")}
                className="w-full px-4 py-2.5 bg-white/5 border border-blue-400/30 rounded-xl 
                          text-blue-100 placeholder-blue-400/50 text-sm focus:outline-none
                          focus:border-blue-400/60 transition-colors"
              />
              {/* Animated focus ring simulation */}
              <div className="absolute inset-0 rounded-xl border-2 border-blue-400/0 
                            group-hover:border-blue-400/20 transition-colors" />
            </div>
          </div>

          {/* Name Field - Slides in */}
          <div className="group animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            <label className="block text-xs font-medium text-blue-300 mb-1.5">{t("hero.field_name")}</label>
            <div className="relative">
              <input
                type="text"
                disabled
                placeholder={t("hero.field_name_placeholder")}
                className="w-full px-4 py-2.5 bg-white/5 border border-blue-400/30 rounded-xl 
                          text-blue-100 placeholder-blue-400/50 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button - Pulses */}
          <div className="pt-2 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
            <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 
                            hover:from-blue-500 hover:to-blue-400 rounded-xl text-white 
                            font-semibold text-sm shadow-lg shadow-blue-900/30
                            hover:shadow-blue-800/40 transition-all duration-200
                            active:scale-[0.98]">
              {t("hero.submit_form")}
            </button>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="absolute -bottom-3 -right-3 animate-bounce-slow">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 
                        rounded-full flex items-center justify-center shadow-lg 
                        shadow-green-900/30 border-2 border-white/20 cursor-pointer
                        hover:scale-110 transition-transform">
            <span className="text-white text-lg font-bold">+</span>
          </div>
        </div>
      </div>

      {/* Logic Flow Indicator */}
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
        <div className="px-3 py-1 bg-blue-500/10 border border-blue-400/30 rounded-full 
                      text-[10px] font-medium text-blue-300 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          {t("hero.logic_flow")}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
      </div>
    </div>

    {/* Decorative Corner Elements */}
    <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-blue-400/30 rounded-tr-2xl" />
    <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-purple-400/30 rounded-bl-2xl" />
  </div>

  {/* Floating Badge */}
  <div className="absolute -top-4 -right-4 sm:-right-8 bg-gradient-to-r from-emerald-500 to-green-600 
                px-4 py-2 rounded-full shadow-lg shadow-green-900/30 border border-white/20
                animate-float-slow hidden sm:flex items-center gap-2">
    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
    <span className="text-white text-xs font-bold">{t("hero.live_preview")}</span>
  </div>

  {/* Connection Lines Animation */}
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
        <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M 100 150 Q 200 100 300 150 T 500 150"
      fill="none"
      stroke="url(#lineGradient)"
      strokeWidth="2"
      className="animate-draw-line"
      strokeDasharray="1000"
      strokeDashoffset="1000"
    />
  </svg>
</div>

{/* Custom Animations - Add to your global CSS or use style tag */}
<style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
    50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
  }
  @keyframes float-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes slide-in-right {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  @keyframes draw-line {
    to { stroke-dashoffset: 0; }
  }
  
  .animate-float { animation: float 5s ease-in-out infinite; }
  .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
  .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
  .animate-slide-in-right { animation: slide-in-right 0.5s ease-out forwards; opacity: 0; }
  .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
  .animate-draw-line { animation: draw-line 2s ease-out forwards; }
  
  .perspective-1000 { perspective: 1000px; }
`}</style>
        </div>
      </div>
    </section>
  );
};

