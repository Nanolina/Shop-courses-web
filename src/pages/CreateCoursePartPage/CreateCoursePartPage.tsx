import { LuBookPlus } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import Header from '../../components/Header/Header';
import { EntityType } from '../../types';
import Container from '../../ui/Container/Container';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';

function CreateCoursePartPage() {
  const { type } = useParams<{ type: EntityType }>();

  if (!type) return <ItemNotFoundPage error="Type is not provided" />;

  return (
    <Container>
      <Header label={`Create ${type}`} icon={<LuBookPlus size={24} />} />
      <CoursePartForm type={type} />
    </Container>
  );
}

export default CreateCoursePartPage;
