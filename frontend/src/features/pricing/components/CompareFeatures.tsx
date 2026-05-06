import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react";
import { Minus } from "lucide-react";

type CellValue =
  | { type: "check" }
  | { type: "dash" }
  | { type: "text"; value: string; bold?: boolean; blue?: boolean };

type FeatureRow = {
  key: string;
  starter: CellValue;
  pro: CellValue;
  enterprise: CellValue;
};

const FEATURES: FeatureRow[] = [
  {
    key: "ai_form_generation",
    starter:    { type: "dash" },
    pro:        { type: "text", value: "Included", blue: true, bold: true },
    enterprise: { type: "text", value: "Included", blue: true, bold: true },
  },
  {
    key: "monthly_submissions",
    starter:    { type: "text", value: "100" },
    pro:        { type: "text", value: "5,000", bold: true },
    enterprise: { type: "text", value: "Unlimited", bold: true },
  },
  {
    key: "payment_integration",
    starter:    { type: "dash" },
    pro:        { type: "check" },
    enterprise: { type: "check" },
  },
  {
    key: "custom_branding",
    starter:    { type: "dash" },
    pro:        { type: "check" },
    enterprise: { type: "check" },
  },
  {
    key: "api_access",
    starter:    { type: "dash" },
    pro:        { type: "check" },
    enterprise: { type: "check" },
  },
  {
    key: "support_level",
    starter:    { type: "text", value: "Community" },
    pro:        { type: "text", value: "Priority Email" },
    enterprise: { type: "text", value: "24/7 Dedicated", bold: true },
  },
];

const Cell = ({ value }: { value: CellValue }) => {
  if (value.type === "dash") {
    return (
      <span className="flex justify-center">
        <Minus size={16} className="text-gray-300" />
      </span>
    );
  }

  if (value.type === "check") {
    return (
      <span className="flex justify-center">
        <CheckCircle size={18} className="text-blue-600" strokeWidth={1.5} />
      </span>
    );
  }

  return (
    <span
      className={[
        "text-sm",
        value.bold ? "font-semibold" : "font-normal",
        value.blue ? "text-blue-600" : "text-gray-900",
      ].join(" ")}
    >
      {value.value}
    </span>
  );
};

export const CompareFeatures = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gray-50/50 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
          {t("compare.title")}
        </h2>

        {/* Table */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full table-fixed ">
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>

            <thead>
              <tr className=" bg-gray-200">
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                  {t("compare.col_features")}
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-gray-900">
                  {t("compare.col_starter")}
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-blue-600">
                  {t("compare.col_pro")}
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-gray-900">
                  {t("compare.col_enterprise")}
                </th>
              </tr>
            </thead>

            <tbody>
              {FEATURES.map((row, idx) => (
                <tr
                  key={row.key}
                  className={
                    idx !== FEATURES.length - 1
                      ? ""
                      : ""
                  }
                >
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                    {t(`compare.feature_${row.key}`)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Cell value={row.starter} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Cell value={row.pro} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Cell value={row.enterprise} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
