import { useTranslation } from 'react-i18next';
import { LuBookPlus } from 'react-icons/lu';
import CourseForm from '../../components/CourseForm/CourseForm';
import Header from '../../components/Header/Header';
import { CourseFormProvider } from '../../context';
import { useCourseForm } from '../../hooks';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';

function CreateCourseFormPage() {
  const { t } = useTranslation();

  const courseFormContextValue = useCourseForm();

  return (
    <Container>
      <Header
        label={t('create_course')}
        hasButtonBack={false}
        icon={<LuBookPlus size={24} />}
      />
      <CourseFormProvider value={courseFormContextValue}>
        <CourseForm />
      </CourseFormProvider>

      {courseFormContextValue.isLoading && <Loader />}
      {courseFormContextValue.error && (
        <MessageBox errorMessage={courseFormContextValue.error} />
      )}
    </Container>
  );
}

export default CreateCourseFormPage;
