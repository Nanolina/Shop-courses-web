import { retrieveLaunchParams } from '@tma.js/sdk';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LESSON } from '../consts';
import { createAxiosWithAuth, handleAuthError } from '../functions';
import { ILesson, IModule } from '../types';

const tg = window.Telegram.WebApp;

export function useCoursePartForm() {
  // type - create | update
  // parentId - create | update
  // itemId - update
  const { type, parentId, itemId } = useParams();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLesson, setIsLesson] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Image
  const [imageUrl, setImageUrl] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [useImageUrlCover, setUseImageUrlCover] = useState(true); // State to toggle between image URL and image upload (button)

  // Video (only lesson)
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [video, setVideo] = useState<File | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [useVideoUrlCover, setUseVideoUrlCover] = useState(true); // State to toggle between video URL and video upload (button)

  const { initDataRaw } = retrieveLaunchParams();
  const navigate = useNavigate();

  const createOrUpdateCoursePart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const formData = new FormData();
      formData.append('name', name);
      if (description) formData.append('description', description);
      // Image
      if (imageUrl) formData.append('imageUrl', imageUrl);
      if (image && !isLesson) formData.append('image', image);
      if (image && isLesson) formData.append('files', image, image.name);
      if (!image && !imageUrl) formData.append('isRemoveImage', 'true');

      // Video
      if (isLesson) {
        if (videoUrl) formData.append('videoUrl', videoUrl);
        if (video) formData.append('files', video, video.name);
        if (!video && !videoUrl) formData.append('isRemoveVideo', 'true');
      }

      const axiosWithAuth = createAxiosWithAuth(initDataRaw);

      // Edit module or lesson
      if (isEditMode) {
        const response = await axiosWithAuth.patch<IModule | ILesson>(
          `/${type}/${itemId}`,
          formData
        );
        if (response.status === 200) {
          isLesson
            ? navigate(`/lesson/module/${parentId}`)
            : navigate(`/module/course/${parentId}`);
        }
      } else {
        // Create lesson
        if (isLesson) {
          const response = await axiosWithAuth.post<ILesson>(
            `/lesson/module/${parentId}`,
            formData
          );
          if (response.status === 201) {
            navigate(`/lesson/${response.data.id}`);
          }
          // Create module
        } else {
          const response = await axiosWithAuth.post<IModule>(
            `/module/course/${parentId}`,
            formData
          );
          if (response.status === 201) {
            navigate(`/module/course/${parentId}`);
          }
        }
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [
    initDataRaw,
    name,
    description,
    imageUrl,
    image,
    isLesson,
    isEditMode,
    videoUrl,
    video,
    type,
    itemId,
    navigate,
    parentId,
  ]);

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

  // Video
  const toggleBetweenVideoUrlAndFile = () =>
    setUseVideoUrlCover(!useVideoUrlCover);
  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) =>
    handleFileChange(event, setVideo, setPreviewVideoUrl, setVideoUrl);

  const handleRemoveVideo = () =>
    handleRemoveFile(
      previewVideoUrl,
      setPreviewVideoUrl,
      setVideo,
      setVideoUrl
    );

  const handleVideoUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    handleUrlChange(event, setPreviewVideoUrl, setVideoUrl);

  // useEffect
  useEffect(() => {
    setIsLesson(type === LESSON);
  }, [type]);

  useEffect(() => {
    setIsEditMode(Boolean(itemId));
  }, [itemId]);

  useEffect(() => {
    tg.MainButton.setParams({ text: itemId ? 'Save' : 'Create' });
    tg.onEvent('mainButtonClicked', createOrUpdateCoursePart);
    return () => tg.offEvent('mainButtonClicked', createOrUpdateCoursePart);
  }, [itemId, createOrUpdateCoursePart]);

  useEffect(() => {
    // Lesson
    if (isLesson && name && (videoUrl || video)) {
      tg.MainButton.show();
      // Module
    } else if (!isLesson && name) {
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [isLesson, name, videoUrl, video]);

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
    isLoading,
    error,
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

    // Video
    video,
    setVideo,
    videoUrl,
    setVideoUrl,
    previewVideoUrl,
    setPreviewVideoUrl,
    handleVideoChange,
    handleRemoveVideo,
    handleVideoUrlChange,
    useVideoUrlCover,
    toggleBetweenVideoUrlAndFile,
  };
}
