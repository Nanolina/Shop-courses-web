import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCameraswitch } from 'react-icons/md';
import { currencyOptions } from '../../currency-options';
import { useCourseForm } from '../../hooks';
import { IUseCourseFormReturnType } from '../../pages/types';
import { ICourse } from '../../types';
import Button from '../../ui/Button/Button';
import ImagePreview from '../../ui/ImagePreview/ImagePreview';
import { InputUpload } from '../../ui/InputUpload/InputUpload';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import Select from '../../ui/Select/Select';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './CourseForm.module.css';

function CourseForm({ course }: { course?: ICourse }) {
  const { t } = useTranslation();

  const {
    name,
    setName,
    description,
    setDescription,
    imageUrl,
    category,
    setCategory,
    subcategory,
    setSubcategory,
    price,
    setPrice,
    currency,
    setCurrency,
    error,
    isLoading,
    // Image
    previewUrl,
    handleImageChange,
    handleRemoveImage,
    handleUrlChange,
    useUrlCover,
    toggleBetweenUrlAndFile,
    sortedCategoryOptions,
    sortedSubcategoryOptions,
  } = useCourseForm(course) as IUseCourseFormReturnType;

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <Label text={t('course_name')} isRequired isPadding isBold />
        <TextInput
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
        />
      </div>
      <div className={styles.formGroup}>
        <Label text={t('description')} isPadding isBold />
        <Textarea
          value={description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(event.target.value)
          }
        />
      </div>
      <div className={styles.formGroup}>
        <Label text={t('сategory')} isRequired isPadding isBold />
        <Select
          type="category"
          selectValue={category}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setCategory(event.target.value)
          }
          options={sortedCategoryOptions}
        />
      </div>
      {category && category !== 'other' && (
        <div className={styles.formGroup}>
          <Label text={t('subcategory')} isPadding isBold />
          <Select
            type="subcategory"
            selectValue={subcategory}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setSubcategory(event.target.value)
            }
            options={sortedSubcategoryOptions}
          />
        </div>
      )}
      <div className={styles.formGroup}>
        <Label text={t('price')} isRequired isPadding isBold />
        <TextInput
          value={price}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPrice(parseFloat(event.target.value) || 0)
          }
        />
      </div>
      <div className={styles.formGroup}>
        <Label text={t('currency')} isRequired isPadding isBold />
        <Select
          type="currency"
          selectValue={currency}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setCurrency(event.target.value)
          }
          options={currencyOptions}
        />
      </div>
      <div className={styles.formGroup}>
        <div className={styles.switchButton}>
          <Button
            onClick={toggleBetweenUrlAndFile}
            text={
              useUrlCover
                ? t('switch_to_image_file')
                : t('switch_to_image_link')
            }
            icon={<MdCameraswitch size={36} />}
          />
        </div>
        <Label
          text={
            useUrlCover
              ? t('cover_label_course_link')
              : t('cover_label_file_course')
          }
          isPadding
          isBold
        />

        {useUrlCover ? (
          <TextInput value={imageUrl} onChange={handleUrlChange} />
        ) : (
          <InputUpload
            name="image"
            onChange={handleImageChange}
            acceptFiles="image/*"
          />
        )}
      </div>
      {previewUrl && (
        <div className={styles.image}>
          <ImagePreview
            imagePreview={previewUrl}
            removeImage={handleRemoveImage}
          />
        </div>
      )}

      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default CourseForm;
