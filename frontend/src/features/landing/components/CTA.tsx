import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../auth/store/authStore";

export const CTA = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setView, clearAlerts } = useAuthStore();

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto bg-blue-700 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-900/40">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px] opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-800 rounded-full translate-x-1/2 translate-y-1/2 blur-[100px] opacity-50" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[1.1]">
            {t("cta.title")}
          </h2>
          <p className="text-blue-100/80 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/auth" 
              onClick={() => {
                clearAlerts();
                setView("login");
              }}
              className="bg-white text-blue-700 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl"
            >
              {t("cta.primary")}
            </Link>
            <button 
              onClick={() => {
                clearAlerts();
                setView("login");
                navigate("/auth");
              }}
              className="bg-transparent text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/5 transition-all flex items-center gap-3"
            >
              {t("cta.secondary")}
              <ArrowRight className="w-5 h-5 opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

