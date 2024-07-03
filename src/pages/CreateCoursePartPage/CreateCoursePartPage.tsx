import { useTranslation } from 'react-i18next';
import { LuBookPlus } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import Header from '../../components/Header/Header';
import { getTranslatedType } from '../../functions';
import { EntityType } from '../../types';
import Container from '../../ui/Container/Container';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';

function CreateCoursePartPage() {
  const { t } = useTranslation();

  const { type = '' } = useParams<{ type: EntityType }>();
  const { singular } = getTranslatedType(type, t);

  if (!type) return <ItemNotFoundPage error="Type is not provided" />;

  return (
    <Container>
      <Header
        label={t('create_type', { type: singular })}
        icon={<LuBookPlus size={24} />}
      />
      <CoursePartForm type={type} />
    </Container>
  );
}

export default CreateCoursePartPage;
