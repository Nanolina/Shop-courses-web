import { IoSchoolSharp } from 'react-icons/io5';
import 'swiper/css';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import SearchBar from '../../ui/SearchBar/SearchBar';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <Container>
      <Header />
      <div className={styles.container}>
        <Label text="Pick the perfect course for you" />
        <IoSchoolSharp />
      </div>
      <SearchBar placeholder="Search for courses" />
    </Container>
  );
};

export default HomePage;
