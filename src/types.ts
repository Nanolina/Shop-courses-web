export interface IImage {
  courseId: string;
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
  logo?: IImage;
  modules: IModule[];
}

interface IModule {
  name?: string;
  description?: string;
  videos: string[];
}

export interface IOption {
  value: string;
  label: string;
}

export interface IImageUploadProps {
  onImageChange: (file: File | null) => void;
}
