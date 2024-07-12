import { useMutation, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { useTWAEvent } from '@tonsolutions/telemetree-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PATCH, POST } from '../consts';
import { createAxiosWithAuth, handleAuthError } from '../functions';
import { IMyCreatedCoursesPageParams } from '../pages/types';
import { ICourse, RequestMethodType } from '../types';
import { IOption } from '../ui';

export const currencyOptions: IOption[] = [
  { value: 'TON', label: 'The Open Network (TON)' },
];

const tg = window.Telegram.WebApp;

export function useCourseForm() {
  const { t } = useTranslation();
  const eventBuilder = useTWAEvent();

  const { courseId = '' } = useParams<IMyCreatedCoursesPageParams>();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useUrlCover, setUseUrlCover] = useState(true); // State to toggle between URL and upload (button)
  const [error, setError] = useState<string | null>(null);
  const { initDataRaw } = retrieveLaunchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createOrUpdateCourse = useCallback(
    async (url: string, method: RequestMethodType) => {
      if (!initDataRaw) throw new Error('Not enough authorization data');
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
    },
    [
      initDataRaw,
      name,
      description,
      imageUrl,
      category,
      subcategory,
      price,
      currency,
      image,
    ]
  );

  const createCourseMutation = useMutation({
    mutationFn: () => createOrUpdateCourse('/course', POST),
    onSuccess: (data) => {
      navigate(`/course/${data.id}`);
      eventBuilder.track('Course created', {});
      queryClient.invalidateQueries({
        queryKey: ['allCourses'],
      });
    },
    onError: (error: any) => {
      handleAuthError(error, setError);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: () => createOrUpdateCourse(`/course/${courseId}`, PATCH),
    onSuccess: () => {
      navigate('/course/created');
      queryClient.invalidateQueries({
        queryKey: ['courseDetails', courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['allCourses'],
      });
    },
    onError: (error: any) => {
      handleAuthError(error, setError);
    },
  });

  const onCreateCourse = useCallback(
    () => createCourseMutation.mutate(),
    [createCourseMutation]
  );
  const onUpdateCourse = useCallback(
    () => updateCourseMutation.mutate(),
    [updateCourseMutation]
  );

  const toggleBetweenUrlAndFile = () => setUseUrlCover(!useUrlCover);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setImageUrl(''); // Reset imageUrl if a file is selected
    } else {
      setImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setImage(null);
    setImageUrl('');
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPreviewUrl(value);
    setImageUrl(value);
  };

  useEffect(() => {
    const mainButtonAction = courseId ? onUpdateCourse : onCreateCourse;
    tg.MainButton.setParams({ text: courseId ? t('save') : t('create') });
    tg.onEvent('mainButtonClicked', mainButtonAction);
    return () => tg.offEvent('mainButtonClicked', mainButtonAction);
  }, [onCreateCourse, onUpdateCourse, courseId, t]);

  useEffect(() => {
    if (!name || !category || !price || !currency) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [name, category, price, currency]);

  // Clearing preview image URL to free up resources
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    name,
    setName,
    description,
    setDescription,
    imageUrl,
    setImageUrl,
    category,
    setCategory,
    subcategory,
    setSubcategory,
    price,
    setPrice,
    currency,
    setCurrency,
    currencyOptions,
    error: createCourseMutation.error || updateCourseMutation.error || error,
    // Image
    image,
    setImage,
    previewUrl,
    setPreviewUrl,
    handleImageChange,
    handleRemoveImage,
    handleUrlChange,
    useUrlCover,
    toggleBetweenUrlAndFile,
  };
}
