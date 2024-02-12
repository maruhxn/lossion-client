export interface Topic {
  topicId: number;
  categoryItem: CategoryItem;
  title: string;
  viewCount: number;
  author: AuthorItem;
  commentCount: number;
  favoriteCount: number;
  voteCount: number;
  createdAt: string;
  closedAt: string;
  isClosed: boolean;
}

export interface CategoryItem {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorItem {
  authorId: number;
  username: string;
  profileImage: string;
}
