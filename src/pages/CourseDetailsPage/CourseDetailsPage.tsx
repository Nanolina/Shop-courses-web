import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import CourseDetails from '../../components/CourseDetails/CourseDetails';
import Modal from '../../components/Modal/Modal';
import { SELLER } from '../../consts';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { ICourse, RoleType } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetCourse } from '../types';
import styles from './CourseDetailsPage.module.css';

function CourseDetailsPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false); // State to track the completion of data loading
  const [error, setError] = useState<string>('');
  const [role, setRole] = useState<RoleType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { initDataRaw } = retrieveLaunchParams();

  const getCourseDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<IGetCourse>(
        `/course/${courseId}`
      );
      const { role, course } = response.data;
      setCourse(course);
      setRole(role);
      setIsLoaded(true);
    } catch (error: any) {
      handleAuthError(error, setError);
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, initDataRaw]);

  useEffect(() => {
    getCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleBack = () => navigate(-1);
  const handleEdit = () => navigate(`/course/edit/${courseId}`);
  const handleDelete = () => setModalOpen(true);

  async function deleteCourse() {
    setIsLoading(true);
    try {
      if (!initDataRaw || !course)
        throw new Error('Not enough authorization data or course not found');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      await axiosWithAuth.delete<ICourse>(`/course/${course.id}`);
      navigate('/course/created');
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loader />;
  if (!course && !isLoading && isLoaded) {
    return <ItemNotFoundPage error={error} isLoading={isLoading} />;
  }

  return (
    <>
      {course && role && (
        <>
          <div className={styles.imageContainer}>
            <img
              src={course.imageUrl || '/course.png'}
              alt="Course"
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
            <CourseDetails course={course} role={role} />
            {error && <MessageBox errorMessage={error} />}
          </Container>
          <Modal
            title={
              <div>
                {`Are you sure you want to delete course `}
                <b>{course.name}</b>?
              </div>
            }
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            content={
              <div className={styles.modalTextContainer}>
                <div>All modules and lessons will be irretrievably deleted</div>
              </div>
            }
            confirm={deleteCourse}
            imageUrl="/delete.png"
            buttonRightText="Delete"
          />

          {/* <ModalEarnPoints
            isOpen={true}
            courseName={course.name}
            onClose={() => setModalOpen(false)}
          /> */}
        </>
      )}
    </>
  );
}

export default CourseDetailsPage;
