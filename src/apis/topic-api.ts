/* TOPIC API */

export const TOPIC_BASE_URL = (topicId?: number) =>
  topicId
    ? `${process.env.NEXT_PUBLIC_API_URL}/topics/${topicId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/topics`;

export const CLOSE_TOPIC_URL = (topicId: number) =>
  TOPIC_BASE_URL(topicId) + "/status";

export const VOTE_URL = (topicId: number) => TOPIC_BASE_URL(topicId) + "/vote";

export const GET_MY_TOPICS_URL = () => TOPIC_BASE_URL() + "/my";

export const DELETE_TOPIC_IMAGE_URL = (topicId: number, imageId: number) =>
  TOPIC_BASE_URL(topicId) + `/images/${imageId}`;
