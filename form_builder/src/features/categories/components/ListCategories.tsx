import { useEffect, useState } from "react";
import { categorieApi } from "../api/categorie.api";
import type { Category } from "../types/categorie.type";
import { useTranslation } from "react-i18next";

interface ListCategoriesProps {
  onSelect?: (category: Category) => void;
  onContinue?: (selected: Category[]) => void;
}

export const ListCategories = ({ onSelect, onContinue }: ListCategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [selected, setSelected]     = useState<number[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    categorieApi.getCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (category: Category) => {
    setSelected(prev =>
      prev.includes(category.id)
        ? prev.filter(id => id !== category.id)
        : [...prev, category.id]
    );
    onSelect?.(category);
  };

  const handleContinue = () => {
    const selectedCategories = categories.filter(c => selected.includes(c.id));
    onContinue?.(selectedCategories);
  };

  if (loading) {
    return (
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-6 h-40 animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 underline text-sm"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const activeCategories = categories.filter(c => c.is_active);

  return (
    <section className="py-24 bg-gray-50/50">

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl font-black text-gray-900 mb-3">
          {t("categories.title", "What type of form are you building?")}
        </h2>
        <p className="text-gray-500 text-base font-medium max-w-xl mx-auto">
          {t("categories.subtitle", "Select a category to see specialized templates and fields.")}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4">
        {activeCategories.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">No categories available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activeCategories.map(category => {
              const isSelected  = selected.includes(category.id);
              const iconName    = category.icon ?? "grid-fill";
              const iconColor   = category.color ?? "#6366f1";
              const iconBgStyle = { backgroundColor: `${iconColor}20`, color: iconColor };

              return (
                <button
                  key={category.id}
                  onClick={() => toggleSelect(category)}
                  className={`
                    relative text-left bg-white rounded-2xl p-6 border-1
                    transition-all duration-200 hover:-translate-y-0.5
                    hover:shadow-md focus:outline-none
                    ${isSelected
                      ? "border-blue-500 shadow-md bg-blue-50/30"
                      : "border-gray-100 shadow-sm hover:border-gray-200"
                    }
                  `}
                >
                  {/* Checkmark si sélectionné */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={iconBgStyle}
                  >
                    <i className={`bi bi-${iconName} text-2xl`} />
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-1">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12 flex flex-col items-center gap-3">
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`
            px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200
            ${selected.length > 0
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {t("categories.continue", "Continue with Selection")} →
        </button>

      </div>

    </section>
  );
};