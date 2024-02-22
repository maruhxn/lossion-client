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

export const FindPasswordValidator = z.object({
  accountId: z.string(),
  email: z.string().email(),
});

export type FindPasswordRequest = z.infer<typeof FindPasswordValidator>;

export const GetAuthTokenValidator = z.object({
  accountId: z.string(),
  email: z.string().email(),
  payload: z.string().length(6),
});

export type GetAuthTokenRequest = z.infer<typeof GetAuthTokenValidator>;

export const AnonymousChangePasswordValidator = z.object({
  newPassword: z.string().min(2).max(20),
  confirmNewPassword: z.string().min(2).max(20),
});

export type AnonymousChangePasswordRequest = z.infer<
  typeof AnonymousChangePasswordValidator
>;
