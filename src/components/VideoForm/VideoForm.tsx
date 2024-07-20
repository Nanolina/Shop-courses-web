import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCameraswitch } from 'react-icons/md';
import { useVideo } from '../../hooks';
import { IUseVideoReturnType } from '../../pages';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import TextInput from '../../ui/TextInput/TextInput';
import VideoPlayer from '../../ui/VideoPlayer/VideoPlayer';
import { IVideoFormProps } from '../types';
import styles from './VideoForm.module.css';

function VideoForm({ lesson }: IVideoFormProps) {
  const { t } = useTranslation();

  const {
    videoUrl,
    setVideoUrl,
    previewVideoUrl,
    setPreviewVideoUrl,
    handleVideoUrlChange,
    useVideoUrlCover,
    toggleBetweenVideoUrlAndFile,
    openBotToSendVideo,
    handleRemoveVideo,
  } = useVideo() as IUseVideoReturnType;

  useEffect(() => {
    if (lesson && lesson.videoUrl) {
      setVideoUrl(lesson.videoUrl ?? '');
      setPreviewVideoUrl(lesson.videoUrl ?? '');
    }
  }, [lesson, lesson?.videoUrl, setVideoUrl, setPreviewVideoUrl]);

  return (
    <>
      <div className={styles.formGroup}>
        <div className={styles.switchButton}>
          <Button
            onClick={toggleBetweenVideoUrlAndFile}
            text={
              useVideoUrlCover
                ? t('switch_to_video_file')
                : t('switch_to_video_link')
            }
            icon={<MdCameraswitch size={36} />}
          />
        </div>
        <Label
          text={
            useVideoUrlCover ? t('video_link') : t('cover_label_file_video')
          }
          isPadding
          isBold
        />
        <Label text={t('video_allowed')} isHint isPadding />

        {useVideoUrlCover ? (
          <TextInput value={videoUrl} onChange={handleVideoUrlChange} />
        ) : (
          <Button text="UPLOAD VIDEO" onClick={openBotToSendVideo} />
        )}
      </div>
      {previewVideoUrl && (
        <VideoPlayer url={previewVideoUrl} removeVideo={handleRemoveVideo} />
      )}
    </>
  );
}

export default VideoForm;
