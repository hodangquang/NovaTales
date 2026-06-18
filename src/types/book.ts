export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  rating?: number;
  reads?: number;
  genres?: string[];
  synopsis?: string;
  progress?: number;
  chapterCount?: number;
  chapters?: { number: number; title: string }[];
  content?: string[];
};

export type CommunityPost = {
  id: string;
  author: string;
  avatarUrl: string;
  subtitle: string;
  content: string;
  imageUrl?: string;
  quote?: string;
  likes: number;
  comments: number;
};

export type ReadingList = {
  id: string;
  title: string;
  coverUrl: string;
  bookCount: number;
  saves: number;
};

export type ChapterUpdate = {
  id: string;
  bookId: string;
  title: string;
  chapter: string;
  timeAgo: string;
  coverUrl: string;
};

export type WalletTransaction = {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
};
