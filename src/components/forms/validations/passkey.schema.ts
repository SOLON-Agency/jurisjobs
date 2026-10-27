import { z } from "zod";

export const passkeyNameSchema = z.object({
  friendlyName: z
    .string()
    .trim()
    .min(1, "Numele este obligatoriu")
    .max(120, "Numele poate avea cel mult 120 de caractere"),
});

export type PasskeyNameFormData = z.infer<typeof passkeyNameSchema>;
