import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate, useParams } from 'react-router-dom';
import { LESSON } from '../../consts';
import { capitalizeFirstLetter } from '../../functions';
import { EntityType, ILesson, IModule } from '../../types';
import { InputUpload } from '../../ui/InputUpload/InputUpload';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import VideoPreview from '../../ui/VideoPreview/VideoPreview';
import { createAxiosWithAuth } from '../../utils';
import { ICoursePartFormState } from '../types';
import styles from './CoursePartForm.module.css';

const tg = window.Telegram.WebApp;

function CoursePartForm() {
  const { type = '', parentId } = useParams<{
    type: EntityType;
    parentId: string;
  }>();
  const navigate = useNavigate();

  const [isLesson, setIsLesson] = useState(true);

  const initialStateItem: ICoursePartFormState = {
    name: '',
    description: '',
    imageUrl: '',
    ...(isLesson && {
      videoUrl: '',
      video: null,
    }),
  };

  const [newItem, setNewItem] = useState(initialStateItem);
  const [videoPreview, setVideoPreview] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  const onCreateNewCoursePart = useCallback(async () => {
    try {
      setIsLoading(true);
      const { name, description, imageUrl, videoUrl, video } = newItem;
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description || '');
      if (imageUrl) formData.append('imageUrl', imageUrl);
      if (videoUrl && isLesson) formData.append('videoUrl', videoUrl);
      if (video && isLesson) {
        formData.append('files', video, video.name);
      }

      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      if (isLesson) {
        const response = await axiosWithAuth.post<ILesson>(
          `/lesson/module/${parentId}`,
          formData
        );
        if (response.status === 201) {
          navigate(-1);
        }
      } else {
        const response = await axiosWithAuth.post<IModule>(
          `/module/course/${parentId}`,
          formData
        );
        if (response.status === 201) {
          navigate(-1);
        }
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }, [initDataRaw, isLesson, navigate, newItem, parentId]);

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewItem((prevState) => ({
        ...prevState,
        video: file,
      }));
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
    } else {
      setNewItem((prevState) => ({
        ...prevState,
        video: null,
      }));
      setVideoPreview('');
      URL.revokeObjectURL(videoPreview);
    }
  };

  const removeVideo = () => {
    setNewItem((prevState) => ({
      ...prevState,
      video: null,
    }));
    setVideoPreview('');
    URL.revokeObjectURL(videoPreview);
  };

  useEffect(() => {
    setIsLesson(type === LESSON);
  }, [type]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: 'Save',
    });
    tg.onEvent('mainButtonClicked', onCreateNewCoursePart);
    return () => tg.offEvent('mainButtonClicked', onCreateNewCoursePart);
  }, [onCreateNewCoursePart, navigate]);

  useEffect(() => {
    // Lesson
    if (isLesson && !(newItem.video || newItem.videoUrl)) {
      tg.MainButton.hide();
      // Module
    } else if (!isLesson && !newItem.name) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [newItem.name, newItem.video, newItem.videoUrl, isLesson]);

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
      <form className={styles.formMod}>
        <div className={styles.header}>
          <RxCross2
            className={styles.cross}
            size={24}
            color="var(--tg-theme-accent-text-color)"
            onClick={() => navigate(-1)}
          />
          <h3>Create a new {type}</h3>
        </div>
        <div className={styles.labelInputContainer}>
          <Label text={`${capitalizeFirstLetter(type)} title`} />

          <TextInput
            value={newItem.name}
            placeholder={`Enter the ${type} title`}
            onChange={(event: any) =>
              setNewItem((prevState) => ({
                ...prevState,
                name: event.target.value,
              }))
            }
          />
        </div>
        <div className={styles.labelInputContainer}>
          <Label text={`${capitalizeFirstLetter(type)} description`} />
          <Textarea
            value={newItem.description}
            placeholder={`Enter the ${type} description`}
            onChange={(event: any) =>
              setNewItem((prevState) => ({
                ...prevState,
                description: event.target.value,
              }))
            }
          />
        </div>
        <div className={styles.labelInputContainer}>
          <Label text={`Add a link to the image for ${type}`} />
          <TextInput
            value={newItem.imageUrl}
            placeholder="URL"
            onChange={(event: any) =>
              setNewItem((prevState) => ({
                ...prevState,
                imageUrl: event.target.value,
              }))
            }
          />
        </div>
        {isLesson && (
          <>
            <Label text={'Add a link to the video for lesson'} />
            <TextInput
              value={newItem.videoUrl || ''}
              placeholder="URL"
              onChange={(event: any) =>
                setNewItem((prevState) => ({
                  ...prevState,
                  videoUrl: event.target.value,
                }))
              }
            />
            <Label
              text={
                "If you don't have video, you can upload it here. Supported video formats are mp4 and avi and maximum size for video - 500MB"
              }
            />
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
        )}
      </form>
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}
export default CoursePartForm;
