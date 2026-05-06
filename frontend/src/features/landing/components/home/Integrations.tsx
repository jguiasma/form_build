import { Cloud, Slack, Database, Server, Share2, Table } from "lucide-react";
import { useTranslation } from "react-i18next";

const integrations = [
  { name: "Salesforce", icon: Cloud },
  { name: "AWS S3", icon: Server },
  { name: "Slack", icon: Slack },
  { name: "Datadog", icon: Database },
  { name: "Zapier", icon: Share2 },
  { name: "Sheets", icon: Table },
];

export const Integrations = () => {
  const { t } = useTranslation();
  return (
    <section id="integrations" className="py-24 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-16">
          <div className="max-w-lg">
            <h2 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">{t("integrations.label")}</h2>
            <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">{t("integrations.title")}</h3>
            <p className="text-gray-500 text-lg font-medium">
              {t("integrations.subtitle")}
            </p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button className="px-6 py-2 bg-white shadow-sm rounded-lg text-sm font-bold text-gray-900">{t("integrations.tab_top")}</button>
            <button className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">{t("integrations.tab_directory")}</button>
            <button className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">{t("integrations.tab_api")}</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {integrations.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50/50 hover:border-blue-100 transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
              </div>
              <span className="text-sm font-bold text-gray-900">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
