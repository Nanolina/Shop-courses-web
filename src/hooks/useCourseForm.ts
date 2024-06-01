import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICourse } from '../types';
import { IOption } from '../ui';
import { createAxiosWithAuth } from '../utils';
import { useTonConnect } from './useTonConnect';

export const categoryOptions: IOption[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'art', label: 'Art and design' },
  { value: 'other', label: 'Other' },
];

export const subcategoryOptions: Record<string, IOption[]> = {
  technology: [
    { value: 'full-stack', label: 'Full-stack development' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'other', label: 'Other' },
  ],
  cooking: [
    { value: 'baking', label: 'Baking' },
    { value: 'grilling', label: 'Grilling' },
    { value: 'other', label: 'Other' },
  ],
  art: [
    { value: 'painting', label: 'Painting' },
    { value: 'sculpture', label: 'Sculpture' },
    { value: 'other', label: 'Other' },
  ],
  other: [],
};

export const currencyOptions: IOption[] = [
  { value: 'TON', label: 'The Open Network (TON)' },
];

const tg = window.Telegram.WebApp;

export function useCourseForm() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { wallet } = useTonConnect();
  const { initDataRaw } = retrieveLaunchParams();
  const navigate = useNavigate();

  const onCreateCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description || '');
      if (imageUrl) formData.append('imageUrl', imageUrl);
      formData.append('category', category);
      formData.append('subcategory', subcategory || '');
      formData.append('price', price.toString());
      formData.append('currency', currency);
      formData.append('walletAddressSeller', wallet || '');
      if (image) {
        formData.append('image', image);
      }

      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post<ICourse>('/course', formData);
      if (response.status === 201) {
        navigate(`/course/${response.data.id}`);
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }, [
    initDataRaw,
    name,
    description,
    imageUrl,
    category,
    subcategory,
    price,
    currency,
    wallet,
    image,
    navigate,
  ]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      setImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Create',
    });
    tg.onEvent('mainButtonClicked', onCreateCourse);
    return () => tg.offEvent('mainButtonClicked', onCreateCourse);
  }, [onCreateCourse]);

  useEffect(() => {
    if (!name || !category || !price || !currency || !wallet) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [name, category, price, currency, wallet]);

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
    categoryOptions,
    subcategoryOptions,
    currencyOptions,
    previewUrl,
    setPreviewUrl,
    handleImageChange,
    image,
    setImage,
    isLoading,
    error,
  };
}
