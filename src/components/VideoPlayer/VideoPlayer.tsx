import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import ReactPlayer from 'react-player';
import { UPDATE } from '../../consts';
import Button from '../../ui/Button/Button';
import TextInput from '../../ui/TextInput/TextInput';
import styles from './VideoPlayer.module.css';

const tg = window.Telegram.WebApp;

function VideoPlayer({ url, setUrl, lessonId, type }: any) {
  const [isEdit, setIsEdit]: any = useState(false);

  async function updateVideoUrl() {
    tg.sendData(
      JSON.stringify({
        type,
        id: lessonId,
        method: UPDATE,
        videoUrl: url,
      })
    );
  }

  return (
    <div className={styles.video}>
      <FiEdit
        className={styles.icon}
        color="var(--tg-theme-accent-text-color)"
        size={20}
        onClick={() => setIsEdit(!isEdit)}
      />
      {isEdit && (
        <>
          <TextInput
            value={url}
            onChange={(event: any) => setUrl(event.target.value)}
            placeholder="URL"
          />
          <Button
            text="Send"
            color="var(--tg-theme-accent-text-color)"
            size={18}
            onClick={() => {
              updateVideoUrl();
              setIsEdit(!isEdit);
            }}
          />{' '}
        </>
      )}
      <ReactPlayer
        controls={true}
        url="https://res.cloudinary.com/dbrquscbv/video/upload/v1716293942/course/IMG_2117_px4vgd.mp4"
        height="40vh"
        width="95vw"
        playing={true}
      />
    </div>
  );
}

export default VideoPlayer;
