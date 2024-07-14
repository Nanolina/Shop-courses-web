import { IGetLessons, IGetModules } from '../pages';
import { EntityType } from '../types';
import { createAxiosWithAuth } from './axiosWithAuth';

// API requests
// Modules
export const fetchModulesAPI = async (
  courseId: string | undefined,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw || !courseId)
    throw new Error('Not enough authorization data or no course data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get<IGetModules>(
    `/module/course/${courseId}`
  );
  return response.data;
};

// Lessons
export const fetchLessonsAPI = async (
  moduleId: string | undefined,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw || !moduleId)
    throw new Error('Not enough authorization data or no module data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get<IGetLessons>(
    `/lesson/module/${moduleId}`
  );
  return response.data;
};

// Common
export const deleteCoursePartAPI = async (
  type: EntityType,
  itemId: string,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  await axiosWithAuth.delete<void>(`/${type}/${itemId}`);
};
