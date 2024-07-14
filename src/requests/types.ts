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

export interface ICoursePartDataToCreateOrUpdate {
  name: string;
  description?: string;
  imageUrl?: string;
  image?: File | null;
  videoUrl?: string;
  video?: File | null;
}
