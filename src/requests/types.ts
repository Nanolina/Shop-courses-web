export interface ICourseDataToCreateOrUpdate {
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  image?: File | null;
}
