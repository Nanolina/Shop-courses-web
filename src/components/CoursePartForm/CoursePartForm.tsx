import { ChangeEvent, useEffect } from 'react';
import { MdCameraswitch } from 'react-icons/md';
import { useCoursePartForm } from '../../hooks';
import { IUseCoursePartFormReturnType } from '../../pages';
import { ILesson } from '../../types';
import Button from '../../ui/Button/Button';
import ImagePreview from '../../ui/ImagePreview/ImagePreview';
import { InputUpload } from '../../ui/InputUpload/InputUpload';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import VideoPlayer from '../../ui/VideoPlayer/VideoPlayer';
import { ICoursePartFormProps } from '../types';
import styles from './CoursePartForm.module.css';
import { useTranslation } from 'react-i18next';
import { MODULE } from '../../consts';

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

    // Video
    videoUrl,
    setVideoUrl,
    previewVideoUrl,
    setPreviewVideoUrl,
    handleVideoChange,
    handleRemoveVideo,
    handleVideoUrlChange,
    useVideoUrlCover,
    toggleBetweenVideoUrlAndFile,
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
      if (isLesson && (item as ILesson).videoUrl) {
        const lesson = item as ILesson; // Type assertion to ILesson
        setVideoUrl(lesson.videoUrl ?? '');
        setPreviewVideoUrl(lesson.videoUrl ?? '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, isLesson]);

  if (isLoading) return <Loader />;

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
                ? t('switch_to_file_image')
                : t('switch_to_url_image')
            }
            icon={<MdCameraswitch size={36} />}
          />
        </div>
        <Label
          text={useImageUrlCover ? t('cover_label_url') : t('cover_label_file')}
          isPadding
          isBold
        />

        {useImageUrlCover ? (
          <TextInput value={imageUrl} onChange={handleImageUrlChange} />
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

      {/* Video for lesson */}
      {isLesson && (
        <>
          <div className={styles.formGroup}>
            <div className={styles.switchButton}>
              <Button
                onClick={toggleBetweenVideoUrlAndFile}
                text={
                  useVideoUrlCover
                    ? t('switch_to_file_video')
                    : t('switch_to_url_video')
                }
                icon={<MdCameraswitch size={36} />}
              />
            </div>
            <Label
              text={
                useVideoUrlCover
                  ? t('cover_label_url_video')
                  : t('cover_label_file_video')
              }
              isPadding
              isBold
            />

            {useVideoUrlCover ? (
              <TextInput value={videoUrl} onChange={handleVideoUrlChange} />
            ) : (
              <InputUpload
                name="files"
                onChange={handleVideoChange}
                acceptFiles="video/*"
              />
            )}
          </div>
          {previewVideoUrl && (
            <VideoPlayer
              url={previewVideoUrl}
              removeVideo={handleRemoveVideo}
            />
          )}
        </>
      )}

      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default CoursePartForm;
