import axios from 'axios';
import { createAxiosWithAuth } from '../functions';
import { IGetCourse } from '../pages';
import { ICourse, RequestMethodType } from '../types';
import { ICourseDataToCreateOrUpdate } from './types';

const serverUrl = process.env.REACT_APP_SERVER_URL;

export const fetchAllCoursesAPI = async (): Promise<ICourse[]> => {
  const response = await axios.get<ICourse[]>(`${serverUrl}/course`);
  return response.data;
};

export const fetchAllCoursesByOneCategoryAPI = async (
  category: string
): Promise<ICourse[]> => {
  const response = await axios.get<ICourse[]>(
    `${serverUrl}/course/category/${category}`
  );
  return response.data;
};

export const fetchCourseDetailsAPI = async (
  courseId: string | undefined,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw || !courseId) {
    throw new Error('Not enough authorization data or no course data');
  }
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get<IGetCourse>(`/course/${courseId}`);
  return response.data;
};

export const deleteCourseAPI = async (
  courseId: string | undefined,
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) {
    throw new Error('Not enough authorization data');
  }
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  await axiosWithAuth.delete<void>(`/course/${courseId}`);
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
  formData.append('description', description || '');
  formData.append('category', category);
  if (subcategory) {
    formData.append('subcategory', subcategory);
  }
  formData.append('price', price.toString());
  formData.append('currency', currency);
  if (imageUrl) formData.append('imageUrl', imageUrl);
  if (image) {
    formData.append('image', image);
  }
  if (!image && !imageUrl) {
    formData.append('isRemoveImage', 'true');
  }

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

export const fetchAllMyPurchasedCourses = async (
  initDataRaw: string | undefined
) => {
  if (!initDataRaw) throw new Error('Not enough authorization data');
  const axiosWithAuth = createAxiosWithAuth(initDataRaw);
  const response = await axiosWithAuth.get<ICourse[]>('/course/purchased');
  return response.data;
};
