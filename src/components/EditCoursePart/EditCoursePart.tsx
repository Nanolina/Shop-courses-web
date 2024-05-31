import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { MODULE, UPDATE } from '../../consts';
import { Loader } from '../../ui/Loader/Loader';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import { IEditCoursePartProps } from '../types';
import styles from './EditCoursePart.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function EditCoursePart({ item, type }: IEditCoursePartProps) {
  const [title, setTitle] = useState<string>(item.name);
  const [description, setDescription] = useState<string>(
    item.description || ''
  );
  const [imageUrl, setImageUrl] = useState<string>(item.imageUrl || '');
  const updateData = useMemo(
    () => ({
      type,
      imageUrl,
      description,
      id: item.id,
      name: title,
      method: UPDATE,
    }),
    [type, imageUrl, description, item.id, title]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const tg = window.Telegram.WebApp;

  const updatePartData = useCallback(async () => {
    try {
      const allLessonsApiUrl =
        type === MODULE
          ? `${serverUrl}/module/${item.id}`
          : `${serverUrl}/lesson/${item.id}`;
      const response = await axios.patch(allLessonsApiUrl, updateData);
      setIsLoading(false);
      navigate(-1);
    } catch (error) {
      setError(String(error));
      setIsLoading(false);
    }
  }, [item.id, type, updateData, setIsLoading, navigate, setError]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: `Save`,
    });
    tg.onEvent('mainButtonClicked', updatePartData);
    return () => tg.offEvent('mainButtonClicked', updatePartData);
  }, [tg, updatePartData]);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.icons}>
        <RxCross2
          className={styles.cross}
          color="var(--tg-theme-accent-text-color)"
          size={24}
          // onClick={() => setIsEdit(!isEdit)}
        />
      </div>

      <TextInput
        value={title}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(event.target.value)
        }
        placeholder={`Enter the ${type} title`}
      />

      <Textarea
        value={description}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(event.target.value)
        }
        placeholder={`Enter the ${type} description`}
      />

      <TextInput
        value={imageUrl}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setImageUrl(event.target.value)
        }
        placeholder="URL"
      />
      {/* <Button
        text="Send"
        color="var(--tg-theme-accent-text-color)"
        onClick={() => {
          updatePartData();
          setIsEdit(!isEdit);
        }}
      /> */}
    </div>
  );
}

export default React.memo(EditCoursePart);
