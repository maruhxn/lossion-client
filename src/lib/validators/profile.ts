import { z } from "zod";

export const ProfileUpdateValidator = z.object({
  username: z.string().min(2).max(10).optional(),
  email: z.string().optional(),
  profileImage: z.any().optional(),
});

export type ProfileUpdateRequest = z.infer<typeof ProfileUpdateValidator>;

export const PasswordUpdateValidator = z.object({
  currPassword: z.string().min(2).max(20).optional(),
  newPassword: z.string().min(2).max(20),
  confirmNewPassword: z.string().min(2).max(20),
});

export type PasswordUpdateeRequest = z.infer<typeof PasswordUpdateValidator>;
