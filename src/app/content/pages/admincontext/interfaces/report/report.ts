export interface Report {
  id: number;
  type: 'post' | 'user' | 'portfolio' | 'offer';
  targetId: string;      // id of post/user/portfolio/offer
  targetTitle?: string;  // (post title, offer title, etc.)
  reporterId: string;
  reporterName?: string;
  reason: string;
  details?: string;
  createdAt: string;
  status: 'open' | 'dismissed' | 'resolved';
}

