import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { UPDATE } from '../../consts';
import Button from '../../ui/Button/Button';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './EditCoursePart.module.css';

function EditCoursePart({ item, type, isEdit, setIsEdit }: any) {
  const [title, setTitle] = useState(item.name);
  const [description, setDescription] = useState(item.description);

  const tg = window.Telegram.WebApp;

  async function updatePartData() {
    tg.sendData(
      JSON.stringify({
        id: item.id,
        name: title,
        description,
        type,
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
          onClick={() => {
            setIsEdit(() => !isEdit);
          }}
        />
      </div>

      <TextInput
        value={title}
        onChange={(event: any) => setTitle(event.target.value)}
        placeholder={`Enter the ${type} title`}
      />

      <Textarea
        value={description}
        onChange={(event: any) => setDescription(event.target.value)}
        placeholder={`Enter the ${type} description`}
      />

      <Button
        text="Send"
        color="var(--tg-theme-accent-text-color)"
        size={18}
        onClick={() => {
          updatePartData();
          setIsEdit(() => !isEdit);
        }}
      />
    </div>
  );
}

export default React.memo(EditCoursePart);
