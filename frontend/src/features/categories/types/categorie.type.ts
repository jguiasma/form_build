export interface Category {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  is_active: boolean;
}