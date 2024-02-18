import { AuthorItem } from "./topic";

export interface Comment {
  id: number;
  text: string;
  author: AuthorItem;
  replyToId: number;
  repliesCount: number;
  groupId: string;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}
