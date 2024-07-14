import { useMutation, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { useTWAEvent } from '@tonsolutions/telemetree-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryOptions, subcategoryOptions } from '../category-data';
import { PATCH, POST } from '../consts';
import { handleAuthError } from '../functions';
import { IMyCreatedCoursesPageParams } from '../pages/types';
import { createOrUpdateCourseAPI } from '../requests';
import { ICourse } from '../types';

const tg = window.Telegram.WebApp;

export function useCourseForm(course?: ICourse) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const eventBuilder = useTWAEvent();
  const { courseId = '' } = useParams<IMyCreatedCoursesPageParams>();
  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  // State
  const [name, setName] = useState<string>(course?.name || '');
  const [description, setDescription] = useState<string>(
    course?.description || ''
  );
  const [imageUrl, setImageUrl] = useState<string>(course?.imageUrl || '');
  const [category, setCategory] = useState<string>(course?.category || '');
  const [subcategory, setSubcategory] = useState<string>(
    course?.subcategory || ''
  );
  const [price, setPrice] = useState<number>(course?.price || 0);
  const [currency, setCurrency] = useState<string>(course?.currency || '');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    course?.imageUrl || null
  );
  const [useUrlCover, setUseUrlCover] = useState(true); // State to toggle between URL and upload (button)
  const [error, setError] = useState<string | null>(null);

  // Category/subcategory functions
  const getCategoryLabel = (value: string) => t(`categories.${value}`);
  const getSubcategoryLabel = (value: string) => t(`subcategories.${value}`);

  const sortedCategoryOptions = categoryOptions
    .map((option) => ({
      ...option,
      label: getCategoryLabel(option.value),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const sortedSubcategoryOptions =
    category && subcategoryOptions[category]
      ? subcategoryOptions[category]
          .map((option) => ({
            ...option,
            label: getSubcategoryLabel(option.value),
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];

  // Send data to server
  const dataToSend = {
    name,
    description,
    category,
    subcategory,
    price,
    currency,
    imageUrl,
    image,
  };

  const createCourseMutation = useMutation({
    mutationFn: () =>
      createOrUpdateCourseAPI('/course', POST, dataToSend, initDataRaw),
    onSuccess: (data) => {
      navigate(`/course/${data.id}`);
      eventBuilder.track('Course created', {});
      queryClient.invalidateQueries({
        queryKey: ['allCourses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['coursesByOneCategory', data.category],
      });
      queryClient.invalidateQueries({
        queryKey: ['myCreatedCourses', initDataRaw],
      });
    },
    onError: (error: any) => {
      handleAuthError(error, setError);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: () =>
      createOrUpdateCourseAPI(
        `/course/${courseId}`,
        PATCH,
        dataToSend,
        initDataRaw
      ),
    onSuccess: () => {
      navigate('/course/created');
      queryClient.invalidateQueries({
        queryKey: ['courseDetails', courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['allCourses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['coursesByOneCategory', dataToSend.category],
      });
      queryClient.invalidateQueries({
        queryKey: ['myCreatedCourses', initDataRaw],
      });
    },
    onError: (error: any) => {
      handleAuthError(error, setError);
    },
  });

  const updateCourse = useCallback(
    () => updateCourseMutation.mutate(),
    [updateCourseMutation]
  );

  const createCourse = useCallback(
    () => createCourseMutation.mutate(),
    [createCourseMutation]
  );

  const mainButtonAction = courseId ? updateCourse : createCourse;

  // Image functions
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

  // useEffects
  useEffect(() => {
    if (course) {
      setName(course.name);
      setDescription(course.description || '');
      setImageUrl(course.imageUrl || '');
      setCategory(course.category);
      setSubcategory(course.subcategory || '');
      setPrice(course.price);
      setCurrency(course.currency);
      if (course.imageUrl) {
        setPreviewUrl(course.imageUrl);
      }
    }
  }, [course]);

  useEffect(() => {
    tg.MainButton.setParams({ text: courseId ? t('save') : t('create') });
    tg.onEvent('mainButtonClicked', mainButtonAction);
    return () => tg.offEvent('mainButtonClicked', mainButtonAction);
  }, [mainButtonAction, courseId, t]);

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
    sortedCategoryOptions,
    sortedSubcategoryOptions,
    updateCourseMutation,

    error,
    isLoading: createCourseMutation.isPending || updateCourseMutation.isPending,
  };
}
