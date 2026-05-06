import { MousePointer2, Brain, Link2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../auth/store/authStore";

export const Features = () => {
  const { t } = useTranslation();
  const { setView, clearAlerts } = useAuthStore();
  const features = [
    {
      title: t("features.drag_title"),
      description: t("features.drag_desc"),
      icon: MousePointer2,
      link: t("features.drag_link"),
      color: "blue"
    },
    {
      title: t("features.logic_title"),
      description: t("features.logic_desc"),
      icon: Brain,
      link: t("features.logic_link"),
      color: "blue"
    },
    {
      title:  t("features.integration_title"),
      description: t("features.integration_desc"),
      icon: Link2,
      link: t("features.integration_link"),
      color: "blue"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">{t("features.label")}</h2>
        <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">{t("features.title")}</h3>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium">
          {t("features.subtitle")}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
              <p className="text-gray-500 mb-8 leading-relaxed font-medium text-sm">
                {feature.description}
              </p>
              <Link 
                to="/auth" 
                onClick={() => {
                  clearAlerts();
                  setView("login");
                }}
                className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all"
              >
                {feature.link}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

