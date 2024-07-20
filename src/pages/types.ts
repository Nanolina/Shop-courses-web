import { ICoursePartItem } from '../components';
import { EntityType, ICourse, ILesson, IModule, RoleType } from '../types';
import { IOption } from '../ui';

export interface ICoursePartPageProps {
  type: EntityType;
  parentId: string;
  items: ICoursePartItem[];
  role: RoleType;
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
  isLoading: boolean;
  error: string | null;
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
}

export interface IUseVideoReturnType {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  previewVideoUrl: string | null;
  setPreviewVideoUrl: React.Dispatch<React.SetStateAction<string | null>>;
  handleVideoUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  useVideoUrlCover: boolean;
  toggleBetweenVideoUrlAndFile: () => void;
  openBotToSendVideo: () => void;
  handleRemoveVideo: () => void;
  isLoading: boolean;
  error: string;
}

export interface IUseUserPageReturnType {
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  setEmail: (email: string) => void;
  code: string;
  setCode: (code: string) => void;
  showCode: boolean;
  showIsVerifiedEmail: boolean;
  setShowIsVerifiedEmail: (showIsVerifiedEmail: boolean) => void;
  buttonResendCode: boolean;
  setButtonResendCode: (activButton: boolean) => void;
  resendCode: () => void;
  counter: number;
  setCounter: (counter: number) => void;
  showCounter: () => void;
  firstNameDisabled: boolean;
  lastNameDisabled: boolean;
  emailDisabled: boolean;
  isLoading: boolean;
  error: string;
}

export interface IUserPageParams {
  [key: string]: string | undefined;
  userId?: string;
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
