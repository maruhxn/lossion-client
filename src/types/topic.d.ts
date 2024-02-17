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

export interface TopicDetail {
  topicId: number;
  categoryItem: CategoryItem;
  title: string;
  description: string;
  firstChoice: string;
  secondChoice: string;
  author: AuthorItem;
  viewCount: number;
  commentCount: number;
  favoriteCount: number;
  voteCountInfo: VoteCountInfo;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  closedAt: string;
  images: TopicImage[];
}

export interface VoteCountInfo {
  voteCount: number;
  firstChoiceCount: number;
  secondChoiceCount: number;
}

export interface TopicImage {
  imageId: number;
  originalName: string;
  storedName: string;
}
