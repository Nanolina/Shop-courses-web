import { useEffect } from 'react';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import CoursePartList from '../../components/CoursePartList/CoursePartList';
import Header from '../../components/Header/Header';
import { capitalizeFirstLetter } from '../../functions';
import Container from '../../ui/Container/Container';

const tg = window.Telegram.WebApp;

function CoursePartPage({ type, items, setItems, isForm, setIsForm }: any) {
  useEffect(() => {
    const toggleForm = () => {
      setIsForm(!isForm);
    };

    tg.MainButton.setParams({
      text: 'Create new module',
    });
    tg.onEvent('mainButtonClicked', toggleForm);
    return () => tg.offEvent('mainButtonClicked', toggleForm);
  }, [isForm, setIsForm]);

  useEffect(() => {
    if (isForm) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [isForm]);

  return (
    <Container>
      <Header label={`${capitalizeFirstLetter(type)}s`} />
      <CoursePartList type={type} items={items} setItems={setItems} />
      {isForm && (
        <CoursePartForm
          type={type}
          items={items}
          setItems={setItems}
          isForm={isForm}
          setIsForm={setIsForm}
        />
      )}
    </Container>
  );
}

export default CoursePartPage;
