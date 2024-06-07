import { EntityType, ICourse, ILesson, IModule, RoleType } from '../types';

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

export interface ICoursePartFormState {
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  video?: File | null;
}

export interface ICoursePartListProps {
  type: EntityType;
  items: ICoursePartItem[];
  role: RoleType;
  updatePageData: () => void;
}

export interface ICoursesListByCategoryProps {
  category: string;
  courses: ICourse[];
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
  role: RoleType;
  updatePageData: () => void;
}

export interface IVideoPlayerProps {
  url: string;
  setUrl: (url: string) => void;
  lessonId: string;
  type: EntityType;
}

export interface ICourseDetailsProps {
  course: ICourse;
  role: RoleType;
}

export interface ICoursePartFormProps {
  type: EntityType; // for create and edit
  parentId?: string; // for create
  item?: IModule | ILesson; // for edit
}
