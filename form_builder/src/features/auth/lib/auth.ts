import { z } from "zod";
import i18n from "../../../i18n";

/**
 * Zod schema matching RFC 5322 validation rules (same as backend).
 */
const RFC5322_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const authSchema = z.object({
  email: z
    .string()
    .min(1,i18n.t("validation.email_required"))
    .max(254, i18n.t("validation.email_max"))
    .transform((val) => val.toLowerCase().trim())
    .refine((val) => RFC5322_EMAIL_REGEX.test(val), {
      message: i18n.t("validation.email_invalid"),
    }),
});

export type AuthFormValues = z.infer<typeof authSchema>;
