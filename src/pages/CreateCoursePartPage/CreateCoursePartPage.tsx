import { useTranslation } from 'react-i18next';
import { LuBookPlus } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import Header from '../../components/Header/Header';
import { EntityType } from '../../types';
import Container from '../../ui/Container/Container';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';

function CreateCoursePartPage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const { type } = useParams<{ type: EntityType }>();
  // Translate type depending on the current language
  const translatedType =
    currentLanguage === 'ru' ? (type === 'module' ? 'модуля' : 'урока') : type; // for English leave the original

  if (!type) return <ItemNotFoundPage error="Type is not provided" />;

  return (
    <Container>
      <Header
        label={t('create_type', { type: translatedType })}
        icon={<LuBookPlus size={24} />}
      />
      <CoursePartForm type={type} />
    </Container>
  );
}

export default CreateCoursePartPage;
