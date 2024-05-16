import { useEffect, useState } from 'react';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import CoursePartList from '../../components/CoursePartList/CoursePartList';
import Container from '../../ui/Container/Container';

const tg = window.Telegram.WebApp;

function ModulesPage() {
  const [modules, setModules]: any = useState([
    {
      id: '1',
      name: 'Module React courses',
      description:
        'Shop-coursesbjhbhsdbchsbchjbsjcb sdcbjhdbchjdb cdbchjsbhjcbhdjsbc dcbhdjsbchjdsbhjcbsdhj cdbchjsdbchjbds cbcdshjbcjhdsbchj sdcbhjdsbcjhsd cbsdjhcbdsjh cbjhsd cbhjdsbchjs bc',
      courseId: '1',
    },
    {
      id: '2',
      name: 'Module React courses 2',
      description: 'Shop-courses',
      courseId: '1',
    },
  ]);

  const [isForm, setIsForm] = useState(false);

  useEffect(() => {
    const toggleForm = () => {
      setIsForm(!isForm);
    };

    tg.MainButton.setParams({
      text: 'Create new module',
    });
    tg.onEvent('mainButtonClicked', toggleForm);
    return () => tg.offEvent('mainButtonClicked', toggleForm);
  }, [isForm]);

  useEffect(() => {
    if (isForm) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [isForm]);

  return (
    <Container>
      <CoursePartList
        type="modules"
        modules={modules}
        setModules={setModules}
      />
      {isForm && (
        <CoursePartForm
          type="modules"
          modules={modules}
          setModules={setModules}
          isForm={isForm}
          setIsForm={setIsForm}
        />
      )}
    </Container>
  );
}

export default ModulesPage;
