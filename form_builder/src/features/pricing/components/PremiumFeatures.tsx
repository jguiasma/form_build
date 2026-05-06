import { CreditCard , Brain, AudioLines } from "lucide-react";
import { useTranslation } from "react-i18next";

export const PremiumFeatures = () => {
const { t } = useTranslation();
  const PremiumFeatures = [
    {
      title: t("premiumfeatures.ai_powered_title"),
      description: t("premiumfeatures.ai_powered_desc"),
      icon: Brain,
      color: "blue"
    },
    {
      title: t("premiumfeatures.payment_title"),
      description: t("premiumfeatures.payment_desc"),
      icon: CreditCard ,
      color: "blue"
    },
    {
      title:  t("premiumfeatures.voice_form_title"),
      description: t("premiumfeatures.voice_form_desc"),
      icon: AudioLines ,
      color: "blue"
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h3 className="text-3xl md:text-3xl font-black text-gray-900 mb-4">{t("premiumfeatures.title")}</h3>
        <p className="text-gray-500 max-w-2xl mx-auto text-l font-medium">
          {t("premiumfeatures.subtitle")}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {PremiumFeatures.map((feature, idx) => (
            <div key={idx} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group duration-300">
              <div className="w-14 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
              <p className="text-gray-500 mb-8 leading-relaxed font-medium text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
