export interface User {
  id: number;
  name: string;
  email: string;
  role: 'writer' | 'illustrator' | 'admin';
  status: 'active' | 'suspended';
  portfolio: string;
  createdAt?: string;
  portfolioIds?: number;
}
