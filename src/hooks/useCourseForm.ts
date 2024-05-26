import { useCallback, useEffect, useState } from 'react';
import { COURSE, CREATE } from '../consts';
import { IOption } from '../types';
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

export function useCourseForm() {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('');
  const { wallet } = useTonConnect();

  const tg = window.Telegram.WebApp;

  const onSendData = useCallback(() => {
    const course = {
      name,
      description,
      imageUrl,
      category,
      subcategory,
      price,
      currency,
      walletAddressSeller: wallet,
      type: COURSE,
      method: CREATE,
    };
    tg.sendData(JSON.stringify(course));
  }, [
    name,
    description,
    imageUrl,
    category,
    subcategory,
    price,
    currency,
    tg,
    wallet,
  ]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Create',
    });
    tg.onEvent('mainButtonClicked', onSendData);
    return () => tg.offEvent('mainButtonClicked', onSendData);
  }, [onSendData, tg]);

  useEffect(() => {
    if (!name || !category || !price || !currency || !wallet) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [name, category, price, currency, tg.MainButton, wallet]);

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
  };
}
