import { useTranslation } from "react-i18next";

export const AskedQuestions = () => {
  const { t } = useTranslation();

  const questions = [
    {
      title: t("questions.subscription_title"),
      description: t("questions.subscription_desc"),
    },
    {
      title: t("questions.submission_title"),
      description: t("questions.submission_desc"),
    },
    {
      title: t("questions.discount_title"),
      description: t("questions.discount_desc"),
    },
  ];

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
          {t("questions.title")}
        </h2>

        {/* Cards */}
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded-2xl shadow-md px-8 py-6"
            >
              <h4 className="text-base font-bold text-gray-900 mb-2">
                {q.title}
              </h4>
              <p
                className="text-sm leading-relaxed font-medium text-gray-500"
              >
                {q.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};