import { RxCross2 } from 'react-icons/rx';
import { IVideoPreviewProps } from '../types';
import styles from './VideoPreview.module.css';

function VideoPreview({ videoPreview, removeVideo }: IVideoPreviewProps) {
  return (
    <div className={styles.containerWithFullWidth}>
      <div className={styles.container}>
        <video src={videoPreview} className={styles.video} controls />
        <RxCross2
          className={styles.cross}
          color="var(--tg-theme-accent-text-color)"
          size={20}
          onClick={removeVideo}
        />
      </div>
    </div>
  );
}

export default VideoPreview;
