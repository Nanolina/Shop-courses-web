import 'swiper/css';
import CoursesList from '../../components/CoursesList/CoursesList';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';
import SearchBar from '../../ui/SearchBar/SearchBar';

const HomePage = () => {
  return (
    <Container>
      <Header />
      <SearchBar placeholder="Search for courses" />
      <CoursesList />
    </Container>
  );
};

export default HomePage;
