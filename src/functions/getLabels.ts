import type { TFunction } from 'i18next';
import { categoryOptions, subcategoryOptions } from '../category-data';

export const getCategoryLabel = (value: string, t: TFunction) => {
  const category = categoryOptions.find((option) => option.value === value);
  return category ? t(`categories.${category.value}`) : value;
};

export const getSubcategoryLabel = (
  category: string,
  value: string,
  t: TFunction
) => {
  const subcategory = subcategoryOptions[category]?.find(
    (option) => option.value === value
  );
  return subcategory ? t(`subcategories.${subcategory.value}`) : value;
};
