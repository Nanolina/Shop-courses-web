import { ChangeEvent, useEffect } from 'react';
import { MdCameraswitch } from 'react-icons/md';
import { categoryOptions, subcategoryOptions } from '../../category-data';
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
  const {
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
    previewUrl,
    setPreviewUrl,
    handleImageChange,
    handleRemoveImage,
    handleUrlChange,
    useUrlCover,
    toggleBetweenUrlAndFile,
  } = useCourseForm() as IUseCourseFormReturnType;

  // Setting initial values from item
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <Label text="Course name" isRequired isPadding isBold />
        <TextInput
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setName(event.target.value)
          }
        />
      </div>
      <div className={styles.formGroup}>
        <Label text="Description" isPadding isBold />
        <Textarea
          value={description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(event.target.value)
          }
        />
      </div>
      <div className={styles.formGroup}>
        <Label text="Category" isRequired isPadding isBold />
        <Select
          type="category"
          selectValue={category}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            setCategory(event.target.value)
          }
          options={categoryOptions}
        />
      </div>
      {category && category !== 'other' && (
        <div className={styles.formGroup}>
          <Label text="Subcategory" isPadding isBold />
          <Select
            type="subcategory"
            selectValue={subcategory}
            onChange={(event: ChangeEvent<HTMLSelectElement>) =>
              setSubcategory(event.target.value)
            }
            options={subcategoryOptions[category]}
          />
        </div>
      )}
      <div className={styles.formGroup}>
        <Label text="Price" isRequired isPadding isBold />
        <TextInput
          value={price}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setPrice(parseFloat(event.target.value) || 0)
          }
        />
      </div>
      <div className={styles.formGroup}>
        <Label text="Currency" isRequired isPadding isBold />
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
                ? 'Switch to file image upload'
                : 'Switch to image URL input'
            }
            icon={<MdCameraswitch size={36} />}
          />
        </div>
        <Label
          text={
            useUrlCover
              ? 'Cover image URL for the course'
              : 'Upload image for course cover'
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
