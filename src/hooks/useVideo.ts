import { useMutation, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getCSSVariableValue, handleAuthError } from '../functions';
import { openBotToSendVideoAPI, updateVideoUrlAPI } from '../requests';

const tg = window.Telegram.WebApp;

export function useVideo() {
  const { t } = useTranslation();
  const { lessonId } = useParams();

  const queryClient = useQueryClient();

  const [videoUrl, setVideoUrl] = useState<string>('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [useVideoUrlCover, setUseVideoUrlCover] = useState(true); // State to toggle between video URL and video upload (button)
  const [error, setError] = useState<string | null>(null);

  const { initDataRaw } = retrieveLaunchParams();

  const updateVideoUrlMutation = useMutation({
    mutationFn: () => updateVideoUrlAPI(lessonId, videoUrl, initDataRaw),
    onSuccess: (data: string) => {
      setPreviewVideoUrl(data);
      setVideoUrl(data);
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
    },
    onError: (error: any) => {
      handleAuthError(error, setError);
    },
  });

  const updateVideoUrl = useCallback(
    () => updateVideoUrlMutation.mutate(),
    [updateVideoUrlMutation]
  );

  const handleUrlChange = (
    event: ChangeEvent<HTMLInputElement>,
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setFileUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { value } = event.target;
    setPreviewUrl(value);
    setFileUrl(value);
  };

  const toggleBetweenVideoUrlAndFile = () =>
    setUseVideoUrlCover(!useVideoUrlCover);

  const handleRemoveVideo = () => {
    if (previewVideoUrl) {
      URL.revokeObjectURL(previewVideoUrl);
      setPreviewVideoUrl(null);
    }
  };

  const handleVideoUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    handleUrlChange(event, setPreviewVideoUrl, setVideoUrl);

  const openBotToSendVideoMutation = useMutation({
    mutationFn: () => openBotToSendVideoAPI(lessonId, initDataRaw),
    onSuccess: () => {
      tg.close();
    },
    onError: (error: any) => {
      handleAuthError(error, setError);
    },
  });

  const openBotToSendVideo = useCallback(
    () => openBotToSendVideoMutation.mutate(),
    [openBotToSendVideoMutation]
  );

  // useEffects
  useEffect(() => {
    tg.MainButton.setParams({
      text: t('save'),
      is_active: true,
      color: getCSSVariableValue('--tg-theme-button-color'),
    });
    tg.MainButton.show();
    tg.onEvent('mainButtonClicked', updateVideoUrl);
    return () => tg.offEvent('mainButtonClicked', updateVideoUrl);
  }, [updateVideoUrl, t]);

  useEffect(() => {
    if (videoUrl) tg.MainButton.show();
  }, [videoUrl]);

  // Clearing preview video URL to free up resources
  useEffect(() => {
    return () => {
      if (previewVideoUrl) {
        URL.revokeObjectURL(previewVideoUrl);
      }
    };
  }, [previewVideoUrl]);

  return {
    videoUrl,
    setVideoUrl,
    previewVideoUrl,
    setPreviewVideoUrl,
    handleRemoveVideo,
    handleVideoUrlChange,
    useVideoUrlCover,
    toggleBetweenVideoUrlAndFile,
    openBotToSendVideo,

    error,
    isLoading: updateVideoUrlMutation.isPending,
  };
}
