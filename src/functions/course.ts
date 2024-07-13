import axios from 'axios';
import { ICourse, RequestMethodType } from '../types';
import { createAxiosWithAuth } from './axiosWithAuth';
import { ICourseDataToCreateOrUpdate } from './types';

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const groupCoursesByCategory = (
  courses: ICourse[]
): Record<string, ICourse[]> => {
  return courses.reduce<Record<string, ICourse[]>>((acc, course) => {
    acc[course.category] = acc[course.category] || [];
    acc[course.category].push(course);
    return acc;
  }, {});
};

// API requests
export const fetchAllCoursesAPI = async (): Promise<ICourse[]> => {
  const response = await axios.get<ICourse[]>(`${serverUrl}/course`);
  return response.data;
};

export const fetchCourseDetailsAPI = async (
  courseId: string,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get(`/course/${courseId}`);
  return response.data;
};

export const deleteCourseAPI = async (
  courseId: string,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  await axiosWithAuth.delete(`/course/${courseId}`);
};

export const createOrUpdateCourseAPI = async (
  url: string,
  method: RequestMethodType,
  dto: ICourseDataToCreateOrUpdate,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const {
    name,
    description,
    category,
    subcategory,
    price,
    currency,
    imageUrl,
    image,
  } = dto;
  const formData = new FormData();
  formData.append('name', name);
  if (description) formData.append('description', description);
  if (imageUrl) formData.append('imageUrl', imageUrl);
  formData.append('category', category);
  if (subcategory) formData.append('subcategory', subcategory);
  formData.append('price', price.toString());
  formData.append('currency', currency);
  if (image) formData.append('image', image);
  if (!image && !imageUrl) formData.append('isRemoveImage', 'true');

  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth[method]<ICourse>(url, formData);
  return response.data;
};

export const fetchAllMyCreatedCourses = async (
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get<ICourse[]>('/course/created');
  return response.data;
};
