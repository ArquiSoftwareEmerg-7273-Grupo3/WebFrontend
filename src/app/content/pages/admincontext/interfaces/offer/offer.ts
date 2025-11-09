export interface Offer {
  id: number;
  title: string;
  description: string;
  authorId: string; // writer who posted the offer
  createdAt: string;
  status: 'active' | 'removed' | 'closed';
  flagged?: boolean;
}
