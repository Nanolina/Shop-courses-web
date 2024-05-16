import { useEffect, useState } from 'react';
import ModuleForm from '../../components/ModuleForm/ModuleForm';
import ModulesList from '../../components/ModulesList/ModuleList';
import Container from '../../ui/Container/Container';

const tg = window.Telegram.WebApp;

function ModulesPage() {
  const [modules, setModules]: any = useState([
    {
      id: '1',
      name: 'Module React courses',
      description: 'Shop-coursesbjhbhsdbchsbchjbsjcb sdcbjhdbchjdb cdbchjsbhjcbhdjsbc dcbhdjsbchjdsbhjcbsdhj cdbchjsdbchjbds cbcdshjbcjhdsbchj sdcbhjdsbcjhsd cbsdjhcbdsjh cbjhsd cbhjdsbchjs bc',
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
      <ModulesList modules={modules} setModules={setModules} />
      {isForm && (
        <ModuleForm
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
