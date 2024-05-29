import { ICourse } from '../types';

export type EntityType = 'module' | 'lesson';

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
}

export interface ICoursePartItemProps {
  type: EntityType;
  item: ICoursePartItem;
}

export interface ICoursePartListProps {
  type: EntityType;
  items: ICoursePartItem[];
}

export interface ICoursesListByCategoryProps {
  category: string;
  courses: ICourse[];
}

export interface IEditCoursePartProps {
  item: ICoursePartItem;
  type: EntityType;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
}

export interface IHeaderProps {
  label: string;
  hasButtonBack?: boolean;
  isLabelRight?: boolean;
}

export interface IMyCreatedCourseItemProps {
  course: ICourse;
}

export interface IReadyCoursePartProps {
  item: ICoursePartItem;
  type: EntityType;
  isEdit: boolean;
  setIsEdit: (isEdit: boolean) => void;
}

export interface IVideoPlayerProps {
  url: string;
  setUrl: (url: string) => void;
  lessonId: string;
  type: EntityType;
}
