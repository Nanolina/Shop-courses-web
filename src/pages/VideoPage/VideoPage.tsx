import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { LuBookPlus } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import VideoForm from '../../components/VideoForm/VideoForm';
import { useVideo } from '../../hooks';
import { fetchCoursePartDetailsAPI } from '../../requests';
import { ILesson } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { IUseVideoReturnType } from '../types';

function VideoPage() {
  const { lessonId = '' } = useParams<any>();
  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<ILesson>({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const result = await fetchCoursePartDetailsAPI(
        'lesson',
        lessonId,
        initDataRaw
      );
      if ('moduleId' in result) {
        return result; // return only if the result is ILesson
      } else {
        throw new Error('Expected a lesson but got a module');
      }
    },
    enabled: !!lessonId,
    placeholderData: () => {
      return queryClient.getQueryData(['lesson', lessonId]);
    },
  });

  const { error: errorUpdateVideoUrl, isLoading: isLoadingUpdateVideoUrl } =
    useVideo() as IUseVideoReturnType;

  return (
    <Container>
      <Header label="EDIT VIDEO" icon={<LuBookPlus size={24} />} />
      <VideoForm lesson={data} />
      {(isLoading || isLoadingUpdateVideoUrl) && <Loader />}
      {error?.message ||
        (errorUpdateVideoUrl && (
          <MessageBox errorMessage={error?.message || errorUpdateVideoUrl} />
        ))}
    </Container>
  );
}

export default VideoPage;
