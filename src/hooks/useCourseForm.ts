import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();
  const navigate = useNavigate();

  const createOrUpdateCourse = useCallback(
    async (url: string, method: RequestMethodType) => {
      setIsLoading(true);
      try {
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
        if (response.status === 201 && method === POST) {
          navigate(`/course/${response.data.id}`);
        } else if (response.status === 200 && method === PATCH) {
          navigate('/course/created');
        }
      } catch (error: any) {
        handleAuthError(error, setError);
      } finally {
        setIsLoading(false);
      }
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
      navigate,
    ]
  );

  const onCreateCourse = useCallback(
    () => createOrUpdateCourse('/course', 'post'),
    [createOrUpdateCourse]
  );
  const updateCourse = useCallback(
    () => createOrUpdateCourse(`/course/${courseId}`, 'patch'),
    [createOrUpdateCourse, courseId]
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
    const mainButtonAction = courseId ? updateCourse : onCreateCourse;
    tg.MainButton.setParams({ text: courseId ? 'Save' : 'Create' });
    tg.onEvent('mainButtonClicked', mainButtonAction);
    return () => tg.offEvent('mainButtonClicked', mainButtonAction);
  }, [onCreateCourse, updateCourse, courseId]);

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
    isLoading,
    error,
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
