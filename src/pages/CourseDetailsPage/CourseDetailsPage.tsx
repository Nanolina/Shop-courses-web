import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { FaTrashAlt } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import CourseDetails from '../../components/CourseDetails/CourseDetails';
import Modal from '../../components/ModalWindow/Modal';
import { SELLER } from '../../consts';
import { ICourse, RoleType } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { createAxiosWithAuth } from '../../utils';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetCourse } from '../types';
import styles from './CourseDetailsPage.module.css';

function CourseDetailsPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [role, setRole] = useState<RoleType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { initDataRaw } = retrieveLaunchParams();

  const getCourseDetails = useCallback(async () => {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<IGetCourse>(
        `/course/${courseId}`
      );
      const { role, course } = response.data;
      setCourse(course);
      setRole(role);
      setIsLoading(false);
      return course;
    } catch (error: any) {
      setError(error?.message || String(error));
      setIsLoading(false);
    }
  }, [courseId, initDataRaw]);

  useEffect(() => {
    setIsLoading(true);
    getCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleBack = () => navigate(-1);
  const handleEdit = () => navigate(`/course/edit/${courseId}`);
  const handleDelete = () => setModalOpen(true);

  async function deleteCourse() {
    try {
      if (!initDataRaw || !course)
        throw new Error('Not enough authorization data or course not found');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      await axiosWithAuth.delete<ICourse>(`/course/${course.id}`);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  if (isLoading) return <Loader />;
  if (!course) return <ItemNotFoundPage type="course" />;

  return (
    <>
      <div className={styles.imageContainer}>
        <img src={course?.imageUrl} alt="Course" className={styles.image} />
        <IoIosArrowBack
          className={`${styles.icon} ${styles.backIcon}`}
          onClick={handleBack}
          size={20}
        />
        {role === SELLER && (
          <>
            <BiSolidPencil
              className={`${styles.icon} ${styles.editIcon}`}
              onClick={handleEdit}
              size={20}
            />
            <FaTrashAlt
              className={`${styles.icon} ${styles.deleteIcon}`}
              onClick={handleDelete}
              size={20}
            />
          </>
        )}
      </div>
      <Container>
        {role && <CourseDetails course={course} role={role} />}
        {error && <MessageBox errorMessage={error} />}
      </Container>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        content={<h4>{`Are you sure you want to delete ${course.name}?`}</h4>}
        confirm={deleteCourse}
      />
    </>
  );
}

export default CourseDetailsPage;
