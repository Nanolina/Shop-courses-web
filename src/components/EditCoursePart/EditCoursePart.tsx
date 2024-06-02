import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LESSON, MODULE } from '../../consts';
import { ILesson, IModule } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import { createAxiosWithAuth } from '../../utils';
import Header from '../Header/Header';
import { IEditCoursePartProps } from '../types';
import styles from './EditCoursePart.module.css';

const tg = window.Telegram.WebApp;

function EditCoursePart({ item, type }: IEditCoursePartProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(item.name);
  const [description, setDescription] = useState<string>(
    item.description || ''
  );
  const [imageUrl, setImageUrl] = useState<string>(item.imageUrl || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const updateData = useMemo(
    () => ({
      imageUrl,
      description,
      id: item.id,
      name: title,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [imageUrl, description, item.id, title, type]
  );

  const { initDataRaw } = retrieveLaunchParams();

  const updatePartData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      if (type === MODULE) {
        await axiosWithAuth.patch<IModule>(`/module/${item.id}`, updateData);
      }
      if (type === LESSON) {
        await axiosWithAuth.patch<ILesson>(`/lesson/${item.id}`, updateData);
      }
      setIsLoading(false);
      navigate(-1);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }, [initDataRaw, item.id, navigate, type, updateData]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: `Save`,
    });
    tg.onEvent('mainButtonClicked', updatePartData);
    return () => tg.offEvent('mainButtonClicked', updatePartData);
  }, [updatePartData, type]);

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
