import {
  DeployType,
  EntityType,
  ICourse,
  ILesson,
  IModule,
  RoleType,
} from '../types';

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
  parentId: string;
  items: ICoursePartItem[];
  role: RoleType;
  updateItems: () => void;
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
  parentId: string;
  role: RoleType;
  updateItems: () => void;
}

export interface IVideoPlayerProps {
  url: string;
  removeVideo?: () => void;
}

export interface ICourseDetailsProps {
  course: ICourse;
  role: RoleType;
}

export interface ICoursePartFormProps {
  type: EntityType; // create | update
  parentId?: string; // create | update
  item?: IModule | ILesson | undefined; // update
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirm?: () => void;
  buttonRightText?: string;
  children?: any;
}

export interface IModalEarnPointsProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  deployType: DeployType | null;
}

export interface IPointsInfoModalContentProps {
  page: number;
}
