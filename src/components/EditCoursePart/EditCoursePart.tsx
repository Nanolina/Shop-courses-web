import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE, UPDATE } from '../../consts';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import Header from '../Header/Header';
import { IEditCoursePartProps } from '../types';
import styles from './EditCoursePart.module.css';

const tg = window.Telegram.WebApp;
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


  const updatePartData = useCallback(async () => {
    try {
      const allLessonsApiUrl =
        type === MODULE
          ? `${serverUrl}/module/${item.id}`
          : `${serverUrl}/lesson/${item.id}`;
      await axios.patch(allLessonsApiUrl, updateData);
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
  }, [ updatePartData]);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Header label={type} />

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

      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default React.memo(EditCoursePart);
