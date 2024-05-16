import { useState } from 'react';
import { LESSON } from '../../consts';
import CoursePartPage from '../CoursePartPage/CoursePartPage';

function LessonPage() {
  const [isForm, setIsForm] = useState(false);
  const [lessons, setLessons]: any = useState([
    {
      id: '1',
      name: 'Lesson React courses',
      description: 'This lesson for React to Shop-courses',
      courseId: '4',
      moduleId: '1',
    },
    {
      id: '2',
      name: 'Lesson 2 React courses',
      description: 'This 2 lesson for React to Shop-courses',
      courseId: '4',
      moduleId: '1',
    },
  ]);

  return (
    <CoursePartPage
      type={LESSON}
      items={lessons}
      setItems={setLessons}
      isForm={isForm}
      setIsForm={setIsForm}
    />
  );
}

export default LessonPage;
