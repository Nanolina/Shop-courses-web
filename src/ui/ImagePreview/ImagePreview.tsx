import { RxCross2 } from 'react-icons/rx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IImagePreviewProps } from '../types';
import styles from './ImagePreview.module.css';

function ImagePreview({ imagePreview, removeImage }: IImagePreviewProps) {
  return (
    <div className={styles.containerWithFullWidth}>
      <div className={styles.container}>
        <LazyLoadImage
          src={imagePreview}
          alt="Preview"
          effect="blur"
          className={styles.image}
        />
        <RxCross2
          className={styles.cross}
          size={20}
          onClick={removeImage}
        />
      </div>
    </div>
  );
}

export default ImagePreview;
