
export interface PostsResponse {
  content: ApiPostResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Interface para cada post en la respuesta de la API
export interface ApiPostResponse {
  id: number;
  authorId: number;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  active: boolean;
  reactionsCount: number;
  commentsCount: number;
  repostsCount: number;
  viewsCount: number;
  hasMedia: boolean;
  engagementRate: number;
}

// Interface extendida para compatibilidad con el template actual
export interface DisplayPost extends ApiPostResponse {
  authorName?: string;
  authorPhoto?: string;
  authorPremium?: boolean;
  images?: string[];
  likes?: number;
  isLiked?: boolean;
  comments?: DisplayComment[];
  rating?: number;
  showComments?: boolean;
  createdAtDate?: Date;
  visibility?: 'public' | 'private' | 'followers';
}

export interface User {
  id: number;
  name: string;
  photo: string;
  role: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
}

export interface DisplayComment {
  id: number;
  userId: number;
  userName?: string;
  userPhoto?: string;
  content: string;
  createdAt: Date;
  isReply?: boolean;
  likes?: number;
}
