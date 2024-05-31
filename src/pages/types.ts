import { ICoursePartItem } from '../components';
import { EntityType } from '../types';
import { IOption } from '../ui';

export interface ICoursePartPageProps {
  type: EntityType;
  parentId: string;
  items: ICoursePartItem[];
  setItems: (items: any[]) => void;
  isForm: boolean;
  setIsForm: (isForm: boolean) => void;
}

export interface IUseCourseFormReturnType {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  category: string;
  setCategory: (category: string) => void;
  subcategory: string;
  setSubcategory: (subcategory: string) => void;
  price: number;
  setPrice: (price: number) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  categoryOptions: IOption[];
  subcategoryOptions: Record<string, IOption[]>;
  currencyOptions: IOption[];
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  error: string;
}

export interface ILessonsPageParams {
  [key: string]: string | undefined;
  moduleId?: string;
}

export interface IModulesPageParams {
  [key: string]: string | undefined;
  courseId: string;
}

export interface IMyCreatedCoursesPageParams {
  [key: string]: string | undefined;
  userId: string;
}
