import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePacks } from "../hooks/usePacks";

const buttonStyles: Record<string, string> = {
  default:
    "w-full py-2.5 rounded-xl border border-gray-200 text-gray-800 font-medium text-sm hover:bg-gray-50 transition-colors",
  primary:
    "w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors",
  dark:
    "w-full py-2.5 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition-colors",
};

export const Packs = () => {
  const [yearly, setYearly] = useState(false);
  const { t } = useTranslation();
  const { data: packs = [], isError, isLoading } = usePacks();

  if (isLoading) {
    return <div className="text-center py-20">Loading packs...</div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500">Failed to load packs.</div>;

  }

  return (
    <section className="py-24 bg-gray-50/50 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-4xl font-black text-gray-900 mb-4">{t("packs.title")}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-base font-medium mb-8">
          {t("packs.subtitle")}
        </p>

        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <span className={!yearly ? "font-semibold text-gray-900" : ""}>
            {t("packs.monthly")}
          </span>
          <button
            role="switch"
            aria-checked={yearly}
            onClick={() => setYearly((value) => !value)}
            className="relative w-11 h-6 rounded-full bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                yearly ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={yearly ? "font-semibold text-gray-900" : ""}>
            {t("packs.yearly")}
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {t("packs.save_badge")}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5">
        <div className="grid md:grid-cols-3 gap-15 items-start">
          {packs.map((pack, index) => {
            const isFeatured = index === 1;
            const amount = pack.amount ?? 0;
            const price = yearly ? Math.round(amount * 0.8) : amount;
            const buttonVariant = index === 0 ? "default" : index === 1 ? "primary" : "dark";

            return (
              <div
                key={pack.id}
                className={`relative bg-white rounded-3xl p-10 transition hover:-translate-y-1 ${
                  isFeatured ? "shadow-xl border" : "shadow-sm border hover:shadow-lg"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-1">{pack.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{pack.description}</p>

                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-black text-gray-900">DT{price}</span>
                  <span className="text-gray-400 text-sm">/mo</span>

                  {yearly && amount > 0 && (
                    <span className="text-green-600 text-xs ml-1">billed yearly</span>
                  )}
                </div>

                <button className={buttonStyles[buttonVariant]}>Choose Plan</button>

                <ul className="space-y-3 mt-6">
                  {[1, 2, 3].map((featureNumber) => (
                    <li
                      key={featureNumber}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle size={16} className="text-blue-500" />
                      Feature {featureNumber}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
