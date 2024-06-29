import { categoryOptions, subcategoryOptions } from '../category-data';

export const getCategoryLabel = (value: string) => {
  const category = categoryOptions.find((option) => option.value === value);
  return category ? category.label : value;
};

export const getSubcategoryLabel = (category: string, value: string) => {
  const subcategory = subcategoryOptions[category]?.find(
    (option) => option.value === value
  );
  return subcategory ? subcategory.label : value;
};
