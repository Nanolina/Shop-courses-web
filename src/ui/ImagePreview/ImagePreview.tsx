import { RxCross2 } from 'react-icons/rx';
import { IImagePreviewProps } from '../types';
import styles from './ImagePreview.module.css';

function ImagePreview({ imagePreview, removeImage }: IImagePreviewProps) {
  return (
    <div className={styles.containerWithFullWidth}>
      <div className={styles.container}>
        <img src={imagePreview} alt="Preview" className={styles.image} />
        <RxCross2
          className={styles.cross}
          color="var(--tg-theme-accent-text-color)"
          size={20}
          onClick={removeImage}
        />
      </div>
    </div>
  );
}

export default ImagePreview;
