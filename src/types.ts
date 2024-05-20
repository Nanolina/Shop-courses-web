export interface IImage {
  courseId: number;
  id: string;
  publicId: string;
  url: string;
}

export interface ICourse {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  image?: IImage;
  modules: IModule[];
}

export interface IModule {
  id: string;
  name: string;
  description?: string;
  courseId: string;
  imageUrl: string;
}

export interface ILesson {
  id: string;
  name: string;
  description?: string;
  moduleId: string;
  imageUrl: string;
  videos: string[];
}

export interface IOption {
  value: string;
  label: string;
}

export interface IImageUploadProps {
  onImageChange: (file: File | null) => void;
}
