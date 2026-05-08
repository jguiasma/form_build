import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Info, Loader2, Send, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetPublicForm,
  useSaveAnswers,
  useStartForm,
  useSubmitFormResponse,
} from "../hooks/usePublicFormApi";
import { PublicFormError } from "../components/PublicFormError";
import { PublicFormField } from "../components/PublicFormField";
import { PublicFormLoading } from "../components/PublicFormLoading";
import { PublicFormSuccess } from "../components/PublicFormSuccess";
import { validatePublicFormField, validatePublicFormStep } from "../lib/publicFormValidation";
import type {
  PublicFormErrors,
  PublicFormField as PublicFormFieldType,
  PublicFormValues,
  SaveAnswer,
  SubmitFormPayload,
} from "../types/public-form.types";

const PublicForm: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: schema, isError, isLoading } = useGetPublicForm(uuid || "");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<PublicFormValues>({});
  const [responseId, setResponseId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<PublicFormErrors>({});

  const steps = schema?.steps || [];
  const currentStep = steps[currentStepIndex];
  const progress = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 0;

  const startMutation = useStartForm(schema?.id || "");
  const saveAnswersMutation = useSaveAnswers(schema?.id || "", currentStep?.id || "");
  const submitMutation = useSubmitFormResponse(schema?.id || "");

  useEffect(() => {
    if (schema?.id && !responseId) {
      startMutation.mutate(undefined, {
        onSuccess: (response) => {
          setResponseId(response.response_id);
        },
      });
    }
  }, [schema?.id, responseId]);

  const handleInputChange = (fieldId: string | number, value: any) => {
    setFormValues((previousValues) => ({ ...previousValues, [fieldId]: value }));

    const field = steps.flatMap((step) => step.fields).find((item) => item.id === fieldId);
    if (!field) return;

    const error = validatePublicFormField(field, value);
    setErrors((previousErrors) => {
      const nextErrors = { ...previousErrors };
      if (error) nextErrors[fieldId] = error;
      else delete nextErrors[fieldId];
      return nextErrors;
    });
  };

  const toggleChoice = (fieldId: string | number, value: any) => {
    const nextValue = formValues[fieldId] === value ? null : value;
    handleInputChange(fieldId, nextValue);
  };

  const validateStep = () => {
    const result = validatePublicFormStep(currentStep?.fields || [], formValues);
    setErrors(result.errors);

    if (!result.isValid) {
      const firstErrorId = Object.keys(result.errors)[0];
      const element = document.getElementById(`field-${firstErrorId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return result.isValid;
  };

  const saveCurrentStepAnswers = async () => {
    const answersToSave: SaveAnswer[] =
      currentStep?.fields
        .filter((field) => formValues[field.id!] !== undefined)
        .map((field) => ({
          field_id: field.id,
          value:
            typeof formValues[field.id!] === "object"
              ? JSON.stringify(formValues[field.id!])
              : String(formValues[field.id!]),
        })) || [];

    if (answersToSave.length > 0 && responseId) {
      await saveAnswersMutation.mutateAsync({
        response_id: responseId,
        answers: answersToSave,
      });
    }
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    try {
      await saveCurrentStepAnswers();
    } catch (error) {
      console.error("Failed to save answers", error);
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!responseId) return;

    const allFields = steps.flatMap((step) => step.fields);
    const result = validatePublicFormStep(allFields, formValues);
    if (!result.isValid) {
      setErrors(result.errors);

      const firstErrorId = Object.keys(result.errors)[0];
      const errorStepIndex = steps.findIndex((step) =>
        step.fields.some((field) => String(field.id) === firstErrorId)
      );

      if (errorStepIndex !== -1) {
        setCurrentStepIndex(errorStepIndex);
        setTimeout(() => {
          document
            .getElementById(`field-${firstErrorId}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
      }

      return;
    }

    setSubmitting(true);
    try {
      const payload: SubmitFormPayload = { response_id: responseId };

      steps.forEach((step) => {
        step.fields.forEach((field) => {
          if (formValues[field.id!] !== undefined) {
            payload[field.field_key] = formValues[field.id!];
          }
        });
      });

      await submitMutation.mutateAsync(payload);
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Submission failed", error);

      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors;
        const mappedErrors: PublicFormErrors = {};

        steps.forEach((step) => {
          step.fields.forEach((field) => {
            if (serverErrors[field.field_key]) {
              mappedErrors[field.id!] = serverErrors[field.field_key][0];
            }
          });
        });

        setErrors(mappedErrors);
        const firstErrorFieldId = Object.keys(mappedErrors)[0];
        const errorStepIndex = steps.findIndex((step) =>
          step.fields.some((field) => String(field.id) === firstErrorFieldId)
        );

        if (errorStepIndex !== -1) {
          setCurrentStepIndex(errorStepIndex);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const processRows = () => {
    if (!currentStep) return [];

    const rowMap = new Map<number, PublicFormFieldType[]>();
    currentStep.fields.forEach((field) => {
      const order = field.field_order || 0;
      if (!rowMap.has(order)) rowMap.set(order, []);
      rowMap.get(order)!.push(field);
    });

    return Array.from(rowMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, fields]) =>
        fields.sort((a, b) => (a.column_index || 0) - (b.column_index || 0))
      );
  };

  if (isLoading) return <PublicFormLoading />;
  if (isError || !schema) return <PublicFormError />;
  if (isSubmitted) return <PublicFormSuccess />;

  const rows = processRows();

  return (
    <div className="min-h-screen bg-[#f8fbfe] font-['Inter'] selection:bg-blue-100 selection:text-[#1148ad]">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1148ad 2px, transparent 2px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-2xl mx-auto py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(16,24,40,0.12)] border border-slate-100 overflow-hidden"
        >
          <div className="bg-[#f1f5f9] p-8 sm:p-12 text-center relative overflow-hidden border-b border-slate-50">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/micro-fabrics.png")' }}
            />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight relative z-10">
              {schema.title}
            </h1>
            {schema.description && (
              <p className="text-sm font-bold text-slate-400 mt-4 relative z-10 max-w-lg mx-auto leading-relaxed">
                {schema.description}
              </p>
            )}
          </div>

          <div className="p-8 sm:p-12 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-[#1148ad] uppercase tracking-[0.2em]">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  {progress}% Complete
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-[#1148ad] rounded-full"
                />
              </div>
              {currentStep && (
                <h2 className="text-sm font-black text-slate-800 tracking-tight pt-2">
                  {currentStep.title}
                </h2>
              )}
            </div>

            <div className="space-y-8">
              {steps.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                  <Info className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-400">
                    This form doesn't have any steps or fields yet.
                  </p>
                </div>
              ) : (
                rows.map((rowFields, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid gap-6"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
                  >
                    {rowFields.map((field) => (
                      <div key={field.id} id={`field-${field.id}`}>
                        <PublicFormField
                          field={field}
                          values={formValues}
                          errors={errors}
                          submitting={submitting}
                          onChange={handleInputChange}
                          onToggleChoice={toggleChoice}
                          onSubmit={() => {
                            void handleNext();
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="pt-8 flex gap-4">
              {currentStepIndex > 0 && (
                <button
                  onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                  className="flex items-center justify-center p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all font-black text-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={submitting}
                className="flex-1 py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-[0_12px_24px_-4px_rgba(17,72,173,0.35)] flex items-center justify-center gap-2 hover:bg-[#0033cc] hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : currentStepIndex < steps.length - 1 ? (
                  <>
                    Next Step <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Submit Form <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          <footer className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                256-bit SSL Secure
              </span>
            </div>
            <div className="text-slate-400 flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Powered by
              </span>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                FormFlow
              </span>
            </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicForm;
