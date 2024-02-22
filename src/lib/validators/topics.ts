import { z } from "zod";

const MAX_IMAGE_SIZE = 5242880; // 5 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export const TopicSearchValidator = z.object({
  title: z.string().max(255).optional(),
  description: z.string().optional(),
  author: z.string().max(10).optional(),
});

export type TopicSearchRequest = z.infer<typeof TopicSearchValidator>;

export const CreateTopicsValidator = z.object({
  title: z.string().min(2).max(255),
  description: z.string(),
  firstChoice: z.string().min(2).max(255),
  secondChoice: z.string().min(2).max(255),
  closedAt: z.string(),
  categoryId: z.string(),
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    )
    .optional(),
});

export type CreateTopicsRequest = z.infer<typeof CreateTopicsValidator>;

export const UpdateTopicValidator = z.object({
  title: z.string().min(2).max(255).optional(),
  description: z.string().optional(),
  firstChoice: z.string().min(2).max(255).optional(),
  secondChoice: z.string().min(2).max(255).optional(),
  closedAt: z.string().optional(),
  categoryId: z.string().optional(),
  images: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`)
    .refine((files) => files.length <= 5, `Maximum of 5 images are allowed.`)
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_IMAGE_SIZE),
      `Each file size should be less than 5 MB.`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ALLOWED_IMAGE_TYPES.includes(file.type)
        ),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    )
    .optional(),
});

export type UpdateTopicRequest = z.infer<typeof UpdateTopicValidator>;
