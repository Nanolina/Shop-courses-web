import { LuBookPlus } from 'react-icons/lu';
import CourseForm from '../../components/CourseForm/CourseForm';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';
import { useTranslation } from 'react-i18next';

function CreateCourseFormPage() {
  const { t } = useTranslation();

  return (
    <Container>
      <Header
        label={t('create_course')}
        hasButtonBack={false}
        icon={<LuBookPlus size={24} />}
      />
      <CourseForm />
    </Container>
  );
}

export default CreateCourseFormPage;
