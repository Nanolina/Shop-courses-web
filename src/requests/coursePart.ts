import { createAxiosWithAuth } from '../functions/axiosWithAuth';
import { IGetLessons, IGetModules } from '../pages';
import { EntityType, ILesson, IModule, RequestType } from '../types';
import { MODULE } from './../consts';
import { ICoursePartDataToCreateOrUpdate } from './types';

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

export const updateVideoUrlAPI = async (
  lessonId: string | undefined,
  videoUrl: string,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw || !lessonId)
    throw new Error('Not enough authorization data or no lesson data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.patch<string>(
    `/lesson/${lessonId}/video-url`,
    { videoUrl }
  );
  return response.data;
};

export const openBotToSendVideoAPI = async (
  lessonId: string | undefined,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw || !lessonId)
    throw new Error('Not enough authorization data or no lesson data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.post<void>(
    `/lesson/${lessonId}/video`
  );
  return response.data;
};

// Common
export const fetchCoursePartDetailsAPI = async (
  type: EntityType,
  itemId: string,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get<IModule | ILesson>(
    type === MODULE ? `module/${itemId}` : `lesson/${itemId}`
  );
  return response.data;
};

export const deleteCoursePartAPI = async (
  type: EntityType,
  itemId: string,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  await axiosWithAuth.delete<void>(`/${type}/${itemId}`);
};

export const createOrUpdateCoursePartAPI = async (
  type: RequestType,
  itemId: string,
  parentId: string,
  isLesson: boolean,
  isEditMode: boolean,
  dto: ICoursePartDataToCreateOrUpdate,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const { name, description, imageUrl, image } = dto;

  const formData = new FormData();
  formData.append('name', name);
  if (description) formData.append('description', description);
  // Image
  if (imageUrl) formData.append('imageUrl', imageUrl);
  if (image) formData.append('image', image);
  if (!image && !imageUrl) formData.append('isRemoveImage', 'true');

  const axiosWithAuth = createAxiosWithAuth(initDataRaw);

  // Edit module or lesson
  if (isEditMode) {
    const response = await axiosWithAuth.patch<IModule | ILesson>(
      `/${type}/${itemId}`,
      formData
    );
    return response.data;
  } else {
    // Create lesson
    if (isLesson) {
      const response = await axiosWithAuth.post<ILesson>(
        `/lesson/module/${parentId}`,
        formData
      );
      return response.data;
      // Create module
    } else {
      const response = await axiosWithAuth.post<IModule>(
        `/module/course/${parentId}`,
        formData
      );
      return response.data;
    }
  }
};
