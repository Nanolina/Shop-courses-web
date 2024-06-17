export interface ICourse {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  imageUrl?: string;
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
  videoUrl?: string;
}

export type EntityType = 'module' | 'lesson';
export type RoleType = 'user' | 'customer' | 'seller';
export type RequestMethodType = 'post' | 'patch';
