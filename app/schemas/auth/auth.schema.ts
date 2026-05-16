import { email, z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 8 characters")
      .max(255, "name must be less than 255 characters"),
    email: z.string("Invalid email address"),
    password: z.string().min(8, "Password must be at least characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "passwords dont match",
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export type loginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.output<typeof registerSchema>;
