import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { useTWAEvent } from '@tonsolutions/telemetree-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEdit } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate, useParams } from 'react-router-dom';
import CourseDetails from '../../components/CourseDetails/CourseDetails';
import Modal from '../../components/Modal/Modal';
import Points from '../../components/Points/Points';
import { SELLER } from '../../consts';
import {
  deleteCourseAPI,
  fetchCourseDetailsAPI,
  handleAuthError,
} from '../../functions';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetCourse } from '../types';
import styles from './CourseDetailsPage.module.css';

function CourseDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const eventBuilder = useTWAEvent();
  const { courseId } = useParams<{ courseId: string }>();

  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const [errorPage, setErrorPage] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery<IGetCourse>({
    queryKey: ['courseDetails', courseId],
    queryFn: () => fetchCourseDetailsAPI(courseId, initDataRaw),
    enabled: !!courseId,
    placeholderData: () => {
      return queryClient.getQueryData(['courseDetails', courseId]);
    },
  });

  const mutation = useMutation({
    mutationFn: () => deleteCourseAPI(courseId, initDataRaw),
    onSuccess: () => {
      navigate('/course/created');
      eventBuilder.track('Course deleted', {});
      queryClient.invalidateQueries({
        queryKey: ['courseDetails', courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['allCourses'],
      });
    },
    onError: (error: any) => {
      handleAuthError(error, setErrorPage);
    },
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleBack = useCallback(() => navigate(-1), [navigate]);
  const handleEdit = useCallback(
    () => navigate(`/course/edit/${courseId}`),
    [navigate, courseId]
  );
  const handleDelete = useCallback(() => setModalOpen(true), []);

  if (isLoading) {
    return <Loader />;
  }

  if (!data?.course) {
    return <ItemNotFoundPage error={t('item_not_found')} />;
  }

  const { course, role } = data;

  return (
    <>
      {course && role ? (
        <>
          <div className={styles.imageContainer}>
            <LazyLoadImage
              src={
                course.imageUrl ||
                'https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707398/course_nn1fj5.png'
              }
              alt="Course"
              effect="blur"
              className={styles.image}
            />
            <IoIosArrowBack
              className={`${styles.icon} ${styles.backIcon}`}
              onClick={handleBack}
              size={20}
            />
            {role === SELLER && (
              <>
                <FiEdit
                  className={`${styles.icon} ${styles.editIcon}`}
                  onClick={handleEdit}
                  size={20}
                />
                <MdDelete
                  className={`${styles.icon} ${styles.deleteIcon}`}
                  onClick={handleDelete}
                  size={24}
                />
              </>
            )}
          </div>
          <Container>
            <Points />
            <CourseDetails course={course} role={role} />
            {(error || errorPage) && (
              <MessageBox errorMessage={error?.message} />
            )}
          </Container>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            confirm={() => mutation.mutate()}
            buttonRightText={t('delete')}
          >
            <div className={styles.modalContainer}>
              <div className={styles.modalText}>
                {t('delete_course')}
                <b> {course.name}</b>?
              </div>
              <LazyLoadImage
                src="https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707415/delete_jy0ot5.png"
                alt="Delete"
                effect="blur"
                className={styles.modalImage}
              />
              <div className={styles.modalText}>
                <div>{t('warning_delete_course')}</div>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <ItemNotFoundPage isLoading={isLoading} error={t('not_enough_data')} />
      )}
    </>
  );
}

export default CourseDetailsPage;
