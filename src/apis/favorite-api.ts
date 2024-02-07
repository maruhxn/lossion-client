/* FAVORITE API */

export const FAVORITE_BASE_URL = () =>
  `${process.env.NEXT_PUBLIC_API_URL}/favorites`;

export const TOPIC_FAVORITE_URL = (topicId: number) =>
  FAVORITE_BASE_URL() + `/topics/${topicId}`;

export const COMMENTS_FAVORITE_URL = (commentId: number) =>
  FAVORITE_BASE_URL() + `/comments/${commentId}`;
