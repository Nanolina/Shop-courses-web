import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { CREATE, LESSON } from '../../consts';
import { capitalizeFirstLetter } from '../../functions';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './CoursePartForm.module.css';

function CoursePartForm({ type, isForm, setIsForm, parentId }: any) {
  const initialStateItem = {
    name: '',
    description: '',
    imageUrl: '',
    ...(type === LESSON && {
      videoUrl: '',
    }),
  };

  const tg = window.Telegram.WebApp;
  const [newItem, setNewItem] = useState(initialStateItem);

  async function createNewCoursePart() {
    tg.sendData(JSON.stringify({ type, parentId, method: CREATE, ...newItem }));
  }

  const handleResetForm = () => {
    setNewItem(initialStateItem);
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
          <TextInput
            value={newItem.videoUrl}
            placeholder="URL"
            onChange={(event: any) =>
              setNewItem((prevState) => ({
                ...prevState,
                videoUrl: event.target.value,
              }))
            }
          />
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
