import { RxCross2 } from 'react-icons/rx';
import ReactPlayer from 'react-player';
import { IVideoPlayerProps } from '../types';
import styles from './VideoPlayer.module.css';

function VideoPlayer({ url, removeVideo }: IVideoPlayerProps) {
  return (
    <>
      {url ? (
        <div className={styles.container}>
          <ReactPlayer controls={true} url={url} height="50vh" width="100%" />
          {removeVideo && (
            <RxCross2
              className={styles.cross}
              color="var(--tg-theme-accent-text-color)"
              size={20}
              onClick={removeVideo}
            />
          )}
        </div>
      ) : (
        <p>No video available</p>
      )}
    </>
  );
}

export default VideoPlayer;
