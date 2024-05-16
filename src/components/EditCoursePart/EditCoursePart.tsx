import { RxCross2 } from 'react-icons/rx';
import { LESSONS, MODULES } from '../../consts';
import Button from '../../ui/Button/Button';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './EditCoursePart.module.css';

function EditCoursePart({
  type,
  description,
  setDescription,
  title,
  setTitle,
  isEdit,
  setIsEdit,
}: any) {
  const moduleType = type === MODULES;
  const lessonType = type === LESSONS;

  return (
    <div className={styles.container}>
      <div className={styles.icons}>
        <RxCross2
          className={styles.cross}
          color="var(--tg-theme-accent-text-color)"
          size={20}
          onClick={() => {
            setIsEdit(() => !isEdit);
          }}
        />
      </div>
      {moduleType && (
        <TextInput
          value={title}
          onChange={(event: any) => setTitle(event.target.value)}
          placeholder="Enter the module description"
        />
      )}
      {lessonType && (
        <TextInput
          value={title}
          onChange={(event: any) => setTitle(event.target.value)}
          placeholder="Enter the lesson description"
        />
      )}
      {moduleType && (
        <Textarea
          value={description}
          onChange={(event: any) => setDescription(event.target.value)}
          placeholder="Enter the module description"
        />
      )}
      {lessonType && (
        <Textarea
          value={description}
          onChange={(event: any) => setDescription(event.target.value)}
          placeholder="Enter the lessonn description"
        />
      )}
      <Button
        text="Send"
        color="var(--tg-theme-accent-text-color)"
        size={18}
        onClick={() => {
          setIsEdit(() => !isEdit);
        }}
      />
    </div>
  );
}

export default EditCoursePart;
