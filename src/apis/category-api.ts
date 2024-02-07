/* CATEGORY API */

export const CATEGORY_BASE_URL = (categoryId?: number) =>
  categoryId
    ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/categories`;
