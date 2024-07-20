import { useMutation, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { LESSON } from '../consts';
import { handleAuthError } from '../functions';
import { createOrUpdateCoursePartAPI } from '../requests';
import { ILesson, IModule, RequestType } from '../types';

const tg = window.Telegram.WebApp;

export function useCoursePartForm() {
  const { t } = useTranslation();

  // type - create | update
  // parentId - create | update
  // itemId - update
  const { type, parentId, itemId } = useParams();
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLesson, setIsLesson] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Image
  const [imageUrl, setImageUrl] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [useImageUrlCover, setUseImageUrlCover] = useState(true); // State to toggle between image URL and image upload (button)

  const { initDataRaw } = retrieveLaunchParams();
  const navigate = useNavigate();

  // Send data to server
  const dataToSend = {
    name,
    description,
    imageUrl,
    image,
  };

  const createOrUpdateCoursePartMutation = useMutation({
    mutationFn: () =>
      createOrUpdateCoursePartAPI(
        type as RequestType,
        itemId as string,
        parentId as string,
        isLesson,
        isEditMode,
        dataToSend,
        initDataRaw
      ),
    onSuccess: (data: IModule | ILesson) => {
      if (isLesson) {
        navigate(`/lesson/${data.id}/video`);
        queryClient.invalidateQueries({ queryKey: ['lessons', parentId] });
      } else {
        navigate(`/module/course/${parentId}`);
        queryClient.invalidateQueries({ queryKey: ['modules', parentId] });
      }
    },
    onError: (error: any) => {
      handleAuthError(error, setError);
    },
  });

  const createOrUpdateCoursePart = useCallback(
    () => createOrUpdateCoursePartMutation.mutate(),
    [createOrUpdateCoursePartMutation]
  );

  // Common functions for image and video
  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setFileUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setFileUrl(''); // Reset imageUrl if a file is selected
    } else {
      setFile(null);
      setPreviewUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return null;
      });
    }
  };

  const handleRemoveFile = (
    previewUrl: string | null,
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setFileUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setFile(null);
    setFileUrl('');
  };

  const handleUrlChange = (
    event: ChangeEvent<HTMLInputElement>,
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>,
    setFileUrl: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { value } = event.target;
    setPreviewUrl(value);
    setFileUrl(value);
  };

  // Image
  const toggleBetweenImageUrlAndFile = () =>
    setUseImageUrlCover(!useImageUrlCover);
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) =>
    handleFileChange(event, setImage, setPreviewImageUrl, setImageUrl);

  const handleRemoveImage = () =>
    handleRemoveFile(
      previewImageUrl,
      setPreviewImageUrl,
      setImage,
      setImageUrl
    );

  const handleImageUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    handleUrlChange(event, setPreviewImageUrl, setImageUrl);

  // useEffects
  useEffect(() => {
    setIsLesson(type === LESSON);
  }, [type]);

  useEffect(() => {
    setIsEditMode(Boolean(itemId));
  }, [itemId]);

  const getText = useCallback(() => {
    if (isLesson) {
      return 'СОХРАНИТЬ И ПЕРЕЙТИ К ВИДЕО';
    } else if (itemId && !isLesson) {
      return t('save');
    } else {
      return t('create');
    }
  }, [isLesson, itemId, t]);

  useEffect(() => {
    tg.MainButton.setParams({ text: getText() });
    tg.onEvent('mainButtonClicked', createOrUpdateCoursePart);
    return () => tg.offEvent('mainButtonClicked', createOrUpdateCoursePart);
  }, [itemId, createOrUpdateCoursePart, t, getText]);

  useEffect(() => {
    if (name) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [name]);

  // Clearing preview image URL to free up resources
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  return {
    name,
    setName,
    description,
    setDescription,
    isLesson,

    // Image
    image,
    setImage,
    imageUrl,
    setImageUrl,
    previewImageUrl,
    setPreviewImageUrl,
    handleImageChange,
    handleRemoveImage,
    handleImageUrlChange,
    useImageUrlCover,
    toggleBetweenImageUrlAndFile,

    error,
    isLoading: createOrUpdateCoursePartMutation.isPending,
  };
}
