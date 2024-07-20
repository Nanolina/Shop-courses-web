import { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCameraswitch } from 'react-icons/md';
import { MODULE } from '../../consts';
import { useCoursePartForm } from '../../hooks';
import { IUseCoursePartFormReturnType } from '../../pages';
import Button from '../../ui/Button/Button';
import ImagePreview from '../../ui/ImagePreview/ImagePreview';
import { InputUpload } from '../../ui/InputUpload/InputUpload';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import { ICoursePartFormProps } from '../types';
import styles from './CoursePartForm.module.css';

function CoursePartForm({ type, item }: ICoursePartFormProps) {
  const {
    name,
    setName,
    description,
    setDescription,
    isLesson,
    isLoading,
    error,
    // Image
    imageUrl,
    setImageUrl,
    previewImageUrl,
    setPreviewImageUrl,
    handleImageChange,
    handleRemoveImage,
    handleImageUrlChange,
    useImageUrlCover,
    toggleBetweenImageUrlAndFile,
  } = useCoursePartForm() as IUseCoursePartFormReturnType;
  const { t } = useTranslation();

  const translatedTypeName =
    type === MODULE ? t('module_name') : t('lesson_name');

  // Setting initial values from item
  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      if (item.imageUrl) {
        setImageUrl(item.imageUrl);
        setPreviewImageUrl(item.imageUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, isLesson]);

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <Label text={t(translatedTypeName)} isRequired isPadding isBold />
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

      {/* Image */}
      <div className={styles.formGroup}>
        <div className={styles.switchButton}>
          <Button
            onClick={toggleBetweenImageUrlAndFile}
            text={
              useImageUrlCover
                ? t('switch_to_image_file')
                : t('switch_to_image_link')
            }
            icon={<MdCameraswitch size={36} />}
          />
        </div>
        <Label
          text={
            useImageUrlCover ? t('cover_label_link') : t('cover_label_file')
          }
          isPadding
          isBold
        />

        {useImageUrlCover ? (
          <TextInput
            value={imageUrl}
            onChange={handleImageUrlChange}
            type="url"
          />
        ) : (
          <InputUpload
            name="files"
            onChange={handleImageChange}
            acceptFiles="image/*"
          />
        )}
      </div>
      {previewImageUrl && (
        <ImagePreview
          imagePreview={previewImageUrl}
          removeImage={handleRemoveImage}
        />
      )}

      {isLoading && <Loader />}
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default CoursePartForm;
