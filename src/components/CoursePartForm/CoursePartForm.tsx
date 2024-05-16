import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { capitalizeFirstLetter } from '../../functions';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './CoursePartForm.module.css';

function CoursePartForm({ type, items, setItems, isForm, setIsForm }: any) {
  const initialStateItem = {
    id: items.length + 1,
    name: '',
    description: '',
    courseId: '1',
  };

  const [newItem, setNewItem] = useState(initialStateItem);

  const handleAddPart = () => {
    setItems((prevItems: any) => [
      ...prevItems,
      { ...newItem, id: items.length + 1 },
    ]);
  };

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
        <Button
          text="Save"
          onClick={() => {
            handleResetForm();
            setIsForm(!isForm);
            handleAddPart();
          }}
        />
      </form>
    </div>
  );
}
export default CoursePartForm;
