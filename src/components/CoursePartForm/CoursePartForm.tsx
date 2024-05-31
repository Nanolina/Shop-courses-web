import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { CREATE, LESSON } from '../../consts';
import { capitalizeFirstLetter } from '../../functions';
import Button from '../../ui/Button/Button';
import { InputUpload } from '../../ui/InputUpload/InputUpload';
import Label from '../../ui/Label/Label';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import VideoPreview from '../../ui/VideoPreview/VideoPreview';
import { ICoursePartFormProps, ICoursePartFormState } from '../types';
import styles from './CoursePartForm.module.css';

const tg = window.Telegram.WebApp;

function CoursePartForm({
  type,
  isForm,
  setIsForm,
  parentId,
}: ICoursePartFormProps) {
  const initialStateItem: ICoursePartFormState = {
    name: '',
    description: '',
    imageUrl: '',
    ...(type === LESSON && {
      videoUrl: '',
      video: null,
    }),
  };

  const [newItem, setNewItem] = useState(initialStateItem);
  const [videoPreview, setVideoPreview] = useState('');

  async function createNewCoursePart() {
    tg.sendData(JSON.stringify({ type, parentId, method: CREATE, ...newItem }));
  }

  const handleResetForm = () => {
    setNewItem(initialStateItem);
  };

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
    }
  };

  const removeVideo = () => {
    setNewItem((prevState) => ({
      ...prevState,
      video: null,
    }));
    setVideoPreview('');
  };

  return (
    <div className={styles.container}>
      <form className={styles.formMod}>
        <div className={styles.header}>
          <RxCross2
            className={styles.cross}
            size={24}
            color="var(--tg-theme-accent-text-color)"
            onClick={() => setIsForm(!isForm)}
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
        {type === LESSON && (
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
              name="video"
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
        <Button
          text="Save"
          onClick={() => {
            createNewCoursePart();
            handleResetForm();
            setIsForm(!isForm);
          }}
        />
      </form>
    </div>
  );
}
export default CoursePartForm;
