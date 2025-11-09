export interface Portfolio {
  id: number;
  userId: string;
  title: string;
  description?: string;
  items: Array<{ id: string; title?: string; imageUrl: string }>;
  createdAt?: string;
  flagged?: boolean;
}
