import 'swiper/css';
import CoursesList from '../../components/CoursesList/CoursesList';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';
import SearchBar from '../../ui/SearchBar/SearchBar';

const MainPage = () => {
  return (
    <>
      <Header type="main" />
      <Container>
        <SearchBar />
        <CoursesList />
      </Container>
    </>
  );
};

export default MainPage;
