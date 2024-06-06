import { TonConnectButton } from '@tonconnect/ui-react';
import { ChangeEvent, useEffect, useState } from 'react';
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
  const [useUrlCover, setUseUrlCover] = useState(true); // State to toggle between URL and Upload (button)

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
    previewUrl,
    setPreviewUrl,
    isLoading,
    error,
    handleImageChange,
    handleRemoveImage,
    handleUrlChange,
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
        <Label text="Course Name" isRequired isPadding isBold />
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
        <div className={styles.coverButtonContainer}>
          <Label
            text={
              useUrlCover
                ? 'Cover URL image for the course'
                : 'Upload image for course cover'
            }
            isPadding
            isBold
          />
          <Button
            onClick={() => setUseUrlCover(!useUrlCover)}
            className={styles.switchButton}
            text={useUrlCover ? 'Switch to file upload' : 'Switch to URL input'}
            icon={<MdCameraswitch size={26} />}
          />
        </div>
        {useUrlCover ? (
          <TextInput value={imageUrl} onChange={handleUrlChange} />
        ) : (
          <InputUpload
            name={name}
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
      <div className={styles.walletContainer}>
        <Label
          text="TON wallet to receive funds from the sale of this course"
          isRequired
          isPadding
          isBold
        />
        <TonConnectButton />
      </div>
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default CourseForm;
