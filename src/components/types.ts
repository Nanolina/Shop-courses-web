import { EntityType, ICourse } from '../types';

export interface ICoursePartItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  // Lesson
  moduleId?: string;
  videoUrl?: string;
}

export interface ICourseItemProps {
  course: ICourse;
}

export interface ICoursePartFormProps {
  type: EntityType;
  isForm: boolean;
  setIsForm: (isForm: boolean) => void;
  parentId: string;
}

export interface ICoursePartFormState {
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  video?: File | null;
}

export interface ICoursePartItemProps {
  type: EntityType;
  item: ICoursePartItem;
  role: string;
  updatePageData: () => void;
}

export interface ICoursePartListProps {
  type: EntityType;
  items: ICoursePartItem[];
  role: string;
  updatePageData: () => void;
}

export interface ICoursesListByCategoryProps {
  category: string;
  courses: ICourse[];
}

export interface IEditCoursePartProps {
  item: ICoursePartItem;
  type: EntityType | undefined;
}

export interface IHeaderProps {
  label?: string;
  hasButtonBack?: boolean;
  isLabelRight?: boolean;
  icon?: any;
}

export interface IMyCreatedCourseItemProps {
  course: ICourse;
}

export interface IReadyCoursePartProps {
  item: ICoursePartItem;
  type: EntityType;
  role: string;
  updatePageData: () => void;
}

export interface IVideoPlayerProps {
  url: string;
  setUrl: (url: string) => void;
  lessonId: string;
  type: EntityType;
}

export interface ICourseDetailsProps {
  name: string;
  description?: string;
  isUser: boolean;
}
