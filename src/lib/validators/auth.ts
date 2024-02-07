import { z } from "zod";

export const LoginValidator = z.object({
  accountId: z.string(),
  password: z.string().min(2).max(20),
});

export type LoginRequest = z.infer<typeof LoginValidator>;

export const SignUpValidator = z.object({
  accountId: z.string(),
  email: z.string().email(),
  username: z.string().min(2).max(10),
  password: z.string().min(2).max(20),
  confirmPassword: z.string().min(2).max(20),
});

export type SignUpRequest = z.infer<typeof SignUpValidator>;
