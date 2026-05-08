import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Category } from "../../categories/types/categorie.type";
import { useCreateForm, useGetFieldTypes } from "../hooks/useFormApi";

type CreateFormLocationState = {
  category?: Category;
};

export default function CreateFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = (location.state || {}) as CreateFormLocationState;
  const { data: formTypes = [], isLoading: isLoadingTypes } = useGetFieldTypes();
  const createFormMutation = useCreateForm();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [formTypeId, setFormTypeId] = React.useState<number | string>("");
  const [error, setError] = React.useState<string | null>(null);

  const availableFormTypes = formTypes;

  React.useEffect(() => {
    if (!category) {
      navigate("/categories", { replace: true });
      return;
    }

    if (!formTypeId && availableFormTypes.length > 0) {
      setFormTypeId(availableFormTypes[0].id);
    }
  }, [availableFormTypes, category, formTypeId, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!category) {
      setError("Please choose a category first.");
      return;
    }

    if (!formTypeId) {
      setError("Please choose a form type.");
      return;
    }

    try {
      const form = await createFormMutation.mutateAsync({
        title,
        description,
        form_type_id: formTypeId,
        form_category_id: category.id,
      });

      navigate(`/editor/${form.id}`);
    } catch (mutationError: any) {
      const errors = mutationError.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(" "));
        return;
      }

      setError(mutationError.response?.data?.message || "Failed to create form.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfe] flex items-center justify-center p-4 text-slate-900">
      <div className="w-full max-w-xl bg-white border border-slate-100 rounded-[2rem] shadow-xl p-8">
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#1148ad]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </button>

        <p className="text-xs font-black uppercase tracking-widest text-[#1148ad] mb-2">
          {category?.name || "Selected category"}
        </p>
        <h1 className="text-3xl font-black tracking-tight mb-2">Create New Form</h1>
        <p className="text-sm font-medium text-slate-500 mb-8">
          Add the form details, then continue to the editor.
        </p>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Form Title"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#1148ad]"
          />

          <select
            required
            value={formTypeId}
            onChange={(event) => setFormTypeId(event.target.value)}
            disabled={isLoadingTypes}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-[#1148ad]"
          >
            <option value="" disabled>
              {isLoadingTypes ? "Loading form types..." : "Choose form type"}
            </option>
            {availableFormTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none resize-none focus:border-[#1148ad]"
          />

          <button
            type="submit"
            disabled={createFormMutation.isPending}
            className="w-full h-14 rounded-2xl bg-[#1148ad] text-white text-sm font-black hover:bg-[#0033cc] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {createFormMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Form
          </button>
        </form>
      </div>
    </div>
  );
}
