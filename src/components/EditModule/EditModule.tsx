import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './EditModule.module.css';
import { RxCross2 } from 'react-icons/rx';
import Button from '../../ui/Button/Button';

function EditModule({
  description,
  setDescription,
  title,
  setTitle,
  isEdit,
  setIsEdit,
}: any) {
  return (
    <div className={styles.edMod}>
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
      <div className={styles.rows}>
        <img
          className={styles.cover}
          src="https://avatars.githubusercontent.com/u/39895671?v=4"
          alt="cover"
        />
        <div className={styles.info}>
          <TextInput
            value={title}
            onChange={(event: any) => setTitle(() => event.target.value)}
            placeholder="Enter the module description"
          />
        </div>
      </div>
      <div className={styles.rows}>
        {' '}
        <Textarea
          value={description}
          onChange={(event: any) => setDescription(() => event.target.value)}
          placeholder="Enter the module description"
        />
      </div>
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
