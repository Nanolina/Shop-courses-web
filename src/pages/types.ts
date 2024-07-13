import { ICoursePartItem } from '../components';
import { EntityType, ICourse, ILesson, IModule, RoleType } from '../types';
import { IOption } from '../ui';

export interface ICoursePartPageProps {
  type: EntityType;
  parentId: string;
  items: ICoursePartItem[];
  role: RoleType;
  updateItems: () => void;
}

export interface IUseCourseFormReturnType {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
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
  isLoading: boolean;
  error: string;
  // Image
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  useUrlCover: boolean;
  toggleBetweenUrlAndFile: () => void;
  sortedCategoryOptions: IOption[];
  sortedSubcategoryOptions: IOption[];
}

export interface IUseCoursePartFormReturnType {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  isLesson: boolean;
  isLoading: boolean;
  error: string;

  // Image
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  previewImageUrl: string | null;
  setPreviewImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  handleImageUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  useImageUrlCover: boolean;
  toggleBetweenImageUrlAndFile: () => void;

  // Video
  video: File | null;
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  previewVideoUrl: string | null;
  setPreviewVideoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleVideoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveVideo: () => void;
  handleVideoUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  useVideoUrlCover: boolean;
  toggleBetweenVideoUrlAndFile: () => void;
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

export interface IGetCourse {
  course: ICourse;
  role: RoleType;
}

export interface IGetModules {
  modules: IModule[];
  role: RoleType;
}

export interface IGetLessons {
  lessons: ILesson[];
  role: RoleType;
}

export interface IItemNotFoundPageProps {
  error?: string;
  isLoading?: boolean;
  hasButtonBackHeader?: boolean;
}

export interface IEditCoursePartParams
  extends Record<string, string | EntityType> {
  type: EntityType;
  itemId: string;
}
