import { LuBookPlus } from 'react-icons/lu';
import CourseForm from '../../components/CourseForm/CourseForm';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';

function CreateCourseFormPage() {
  return (
    <Container>
      <Header
        label="Create course"
        hasButtonBack={false}
        icon={<LuBookPlus size={24} />}
      />
      <CourseForm />
    </Container>
  );
}

export default CreateCourseFormPage;
