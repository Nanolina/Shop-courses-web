// Interface
export interface ICourse {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  userId: number;
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

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  codeValidation: string;
}

// Type
export type EntityType = 'module' | 'lesson';
export type RoleType = 'user' | 'customer' | 'seller';
export type RequestMethodType = 'post' | 'patch';
export type DeployType = 'create' | 'purchase';
export type RequestType = 'create' | 'update';

// Enum
export enum StatusEnum {
  Success = 'success',
  Error = 'error',
}
export enum DeployEnum {
  Create = 'create',
  Purchase = 'purchase',
}
export enum RequestTypeEnum {
  Create = 'create',
  Update = 'update',
}
