export interface ICourse {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  walletAddressSeller: string;
  modules: IModule[];
}

export interface IModule {
  id: string;
  name: string;
  description?: string;
  courseId: string;
  imageUrl?: string;
  lessons: ILesson[];
}

export interface ILesson {
  id: string;
  name: string;
  description?: string;
  moduleId: string;
  imageUrl?: string;
  videoUrl: string;
}

export interface IOption {
  value: string;
  label: string;
}

export interface IImageUploadProps {
  onImageChange: (file: File | null) => void;
}
