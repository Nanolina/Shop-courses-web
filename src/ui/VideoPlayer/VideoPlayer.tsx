import { RxCross2 } from 'react-icons/rx';
import ReactPlayer from 'react-player';
import { IVideoPlayerProps } from '../../components/types';
import styles from './VideoPlayer.module.css';

function VideoPlayer({ url, removeVideo }: IVideoPlayerProps) {
  return (
    <div className={styles.container}>
      <ReactPlayer controls={true} url={url} width="100%" height="100%" />
      {removeVideo && (
        <RxCross2 className={styles.cross} size={22} onClick={removeVideo} />
      )}
    </div>
  );
}

export default VideoPlayer;
