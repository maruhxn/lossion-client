/* COMMENT API */

export const COMMENT_BASE_URL = (topicId: number, commentId?: number) =>
  commentId
    ? `${process.env.NEXT_PUBLIC_API_URL}/topics/${topicId}/comments/${commentId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/topics/${topicId}/comments`;

export const GET_REPLIES_URL = (topicId: number, groupId: string) =>
  COMMENT_BASE_URL(topicId) + `/groups/${groupId}`;
