import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { UPDATE } from '../../consts';
import Button from '../../ui/Button/Button';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import { IEditCoursePartProps } from '../types';
import styles from './EditCoursePart.module.css';

function EditCoursePart({
  item,
  type,
  isEdit,
  setIsEdit,
}: IEditCoursePartProps) {
  const [title, setTitle] = useState<string>(item.name);
  const [description, setDescription] = useState<string>(
    item.description || ''
  );
  const [imageUrl, setImageUrl] = useState<string>(item.imageUrl || '');

  const tg = window.Telegram.WebApp;

  async function updatePartData() {
    tg.sendData(
      JSON.stringify({
        type,
        imageUrl,
        description,
        id: item.id,
        name: title,
        method: UPDATE,
      })
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.icons}>
        <RxCross2
          className={styles.cross}
          color="var(--tg-theme-accent-text-color)"
          size={24}
          onClick={() => setIsEdit(!isEdit)}
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

      <Button
        text="Send"
        color="var(--tg-theme-accent-text-color)"
        size={18}
        onClick={() => {
          updatePartData();
          setIsEdit(!isEdit);
        }}
      />
    </div>
  );
}

export default React.memo(EditCoursePart);
