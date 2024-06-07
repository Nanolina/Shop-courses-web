import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { MdCameraswitch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LESSON } from '../../consts';
import {
  capitalizeFirstLetter,
  createAxiosWithAuth,
  handleAuthError,
} from '../../functions';
import { ILesson, IModule } from '../../types';
import Button from '../../ui/Button/Button';
import ImagePreview from '../../ui/ImagePreview/ImagePreview';
import { InputUpload } from '../../ui/InputUpload/InputUpload';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import { ICoursePartFormProps, ICoursePartFormState } from '../types';
import styles from './CoursePartForm.module.css';

const tg = window.Telegram.WebApp;

function CoursePartForm({ type, parentId, item }: ICoursePartFormProps) {
  const navigate = useNavigate();

  const isEditMode = Boolean(item);
  const isLesson = type === LESSON;

  const initialStateItem: ICoursePartFormState = {
    name: item ? item.name : '',
    description: item ? item.description || '' : '',
    imageUrl: item ? item.imageUrl || '' : '',
    ...(isLesson && {
      videoUrl: item && 'videoUrl' in item ? item.videoUrl || '' : '',
      video: null,
    }),
  };

  const [itemData, setItemData] = useState(initialStateItem);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [useUrlCover, setUseUrlCover] = useState(true); // State to toggle between image URL and image upload (button)
  const [videoPreview, setVideoPreview] = useState(
    item && 'videoUrl' in item ? item.videoUrl || '' : ''
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  const saveCoursePart = useCallback(async () => {
    setIsLoading(true);
    try {
      const { name, description, imageUrl, videoUrl, video } = itemData;
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const formData = new FormData();
      formData.append('name', name);
      if (description) formData.append('description', description);
      if (imageUrl) formData.append('imageUrl', imageUrl);
      if (videoUrl && isLesson) formData.append('videoUrl', videoUrl);
      if (video && isLesson) {
        formData.append('files', video, video.name);
      }

      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      if (isEditMode) {
        await axiosWithAuth.patch<ILesson>(`/${type}/${item?.id}`, formData);
      } else {
        if (isLesson) {
          await axiosWithAuth.post<ILesson>(
            `/lesson/module/${parentId}`,
            formData
          );
        } else {
          await axiosWithAuth.post<IModule>(
            `/module/course/${parentId}`,
            formData
          );
        }
      }
      navigate(-1);
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [
    itemData,
    initDataRaw,
    isLesson,
    isEditMode,
    navigate,
    type,
    item?.id,
    parentId,
  ]);

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setItemData((prevState) => ({
        ...prevState,
        video: file,
      }));
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    } else {
      setItemData((prevState) => ({
        ...prevState,
        video: null,
      }));
      setVideoPreview('');
      URL.revokeObjectURL(videoPreview);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setItemData((prevState) => ({
        ...prevState,
        image: file,
      }));
      const fileUrl = URL.createObjectURL(file);
      setPreviewImageUrl(fileUrl);
      setItemData((prevState) => ({
        ...prevState,
        imageUrl: '',
      })); // Reset imageUrl if a file is selected
    } else {
      setItemData((prevState) => ({
        ...prevState,
        image: null,
      }));
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
        setPreviewImageUrl(null);
      }
    }
  };

  const handleRemoveImage = () => {
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl(null);
    }
    setItemData((prevState) => ({
      ...prevState,
      image: null,
    }));
    setItemData((prevState) => ({
      ...prevState,
      imageUrl: '',
    }));
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPreviewImageUrl(value);
    setItemData((prevState) => ({
      ...prevState,
      imageUrl: value,
    }));
  };

  const removeVideo = () => {
    setItemData((prevState) => ({
      ...prevState,
      video: null,
    }));
    setVideoPreview('');
    URL.revokeObjectURL(videoPreview);
  };

  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Save',
    });
    tg.onEvent('mainButtonClicked', saveCoursePart);
    return () => tg.offEvent('mainButtonClicked', saveCoursePart);
  }, [saveCoursePart, navigate]);

  useEffect(() => {
    // Lesson
    if (isLesson && !(itemData.video || itemData.videoUrl)) {
      tg.MainButton.hide();
      // Module
    } else if (!isLesson && !itemData.name) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [itemData.name, itemData.video, itemData.videoUrl, isLesson]);

  // Clearing preview video URL to free up resources
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <Label
          text={`${capitalizeFirstLetter(type)} title`}
          isRequired
          isPadding
          isBold
        />
        <TextInput
          value={itemData.name}
          placeholder={`Enter the ${type} title`}
          onChange={(event: any) =>
            setItemData((prevState) => ({
              ...prevState,
              name: event.target.value,
            }))
          }
        />
      </div>
      <div className={styles.formGroup}>
        <Label
          text={`${capitalizeFirstLetter(type)} description`}
          isPadding
          isBold
        />
        <Textarea
          value={itemData.description}
          placeholder={`Enter the ${type} description`}
          onChange={(event: any) =>
            setItemData((prevState) => ({
              ...prevState,
              description: event.target.value,
            }))
          }
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
          <TextInput value={itemData.imageUrl} onChange={handleUrlChange} />
        ) : (
          <InputUpload
            name="image"
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
      {/* {isLesson && (
          <>
            <Label text={'Add a link to the video for lesson'} />
            <TextInput
              value={itemData.videoUrl || ''}
              placeholder="URL"
              onChange={(event: any) =>
                setItemData((prevState) => ({
                  ...prevState,
                  videoUrl: event.target.value,
                }))
              }
            />
            <Label text={"If you don't have video, you can upload it here"} />
            <InputUpload
              name="files"
              onChange={handleVideoChange}
              acceptFiles="video/*"
            />
            {videoPreview && (
              <VideoPreview
                videoPreview={videoPreview}
                removeVideo={removeVideo}
              />
            )}
          </>
        )} */}
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default CoursePartForm;
