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
  const { name, description, imageUrl, image, videoUrl, video } = dto;

  const formData = new FormData();
  formData.append('name', name);
  if (description) formData.append('description', description);
  // Image
  if (imageUrl) formData.append('imageUrl', imageUrl);
  if (image && !isLesson) formData.append('image', image);
  if (image && isLesson) formData.append('files', image, image.name);
  if (!image && !imageUrl) formData.append('isRemoveImage', 'true');

  // Video
  if (isLesson) {
    if (videoUrl) formData.append('videoUrl', videoUrl);
    if (video) formData.append('files', video, video.name);
    if (!video && !videoUrl) formData.append('isRemoveVideo', 'true');
  }

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
