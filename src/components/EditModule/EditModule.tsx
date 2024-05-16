import { RxCross2 } from 'react-icons/rx';
import Button from '../../ui/Button/Button';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './EditModule.module.css';

function EditModule({
  description,
  setDescription,
  title,
  setTitle,
  isEdit,
  setIsEdit,
}: any) {
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
      <TextInput
        value={title}
        onChange={(event: any) => setTitle(event.target.value)}
        placeholder="Enter the module description"
      />
      <Textarea
        value={description}
        onChange={(event: any) => setDescription(event.target.value)}
        placeholder="Enter the module description"
      />
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

export default EditModule;
