import { ChangeEvent, useEffect } from 'react';
import { MdCameraswitch } from 'react-icons/md';
import { capitalizeFirstLetter } from '../../functions';
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
import VideoPreview from '../../ui/VideoPreview/VideoPreview';
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

  // Setting initial values from item
  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      if (item.imageUrl) {
        setImageUrl(item.imageUrl);
        setPreviewImageUrl(item.imageUrl);
      }
      if (isLesson && 'videoUrl' in item) {
        const lessonItem = item as ILesson; // Type assertion
        setVideoUrl(lessonItem.videoUrl || '');
        setPreviewVideoUrl(lessonItem.videoUrl || '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <Label
          text={`${capitalizeFirstLetter(type)} name`}
          isRequired
          isPadding
          isBold
        />
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

      {/* Image */}
      <div className={styles.formGroup}>
        <div className={styles.switchButton}>
          <Button
            onClick={toggleBetweenImageUrlAndFile}
            text={
              useImageUrlCover
                ? 'Switch to file image upload'
                : 'Switch to image URL input'
            }
            icon={<MdCameraswitch size={36} />}
          />
        </div>
        <Label
          text={
            useImageUrlCover
              ? `Cover image URL for the ${type}`
              : `Upload image for ${type} cover`
          }
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
        <div className={styles.image}>
          <ImagePreview
            imagePreview={previewImageUrl}
            removeImage={handleRemoveImage}
          />
        </div>
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
                    ? 'Switch to file video upload'
                    : 'Switch to video URL input'
                }
                icon={<MdCameraswitch size={36} />}
              />
            </div>
            <Label
              text={
                useVideoUrlCover
                  ? `Cover video URL for the lesson`
                  : `Upload video for the lesson`
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
            <div className={styles.image}>
              <VideoPreview
                videoPreview={previewVideoUrl}
                removeVideo={handleRemoveVideo}
              />
            </div>
          )}
        </>
      )}

      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default CoursePartForm;
