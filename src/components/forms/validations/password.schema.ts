import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Introduceți o adresă de e-mail validă"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Parola trebuie să aibă cel puțin 6 caractere"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Parolele nu corespund",
      });
    }
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
