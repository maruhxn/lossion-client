import { z } from "zod";

export const CreateCommentValidator = z.object({
  text: z.string(),
  replyToId: z.number().optional(),
});

export type CreateCommentRequest = z.infer<typeof CreateCommentValidator>;

export const UpdateCommentValidator = z.object({
  text: z.string(),
});

export type UpdateCommentRequest = z.infer<typeof UpdateCommentValidator>;
