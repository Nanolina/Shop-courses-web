import { useState } from 'react';
import { MODULE } from '../../consts';
import CoursePartPage from '../CoursePartPage/CoursePartPage';

function ModulesPage() {
  const [isForm, setIsForm] = useState(false);
  const [modules, setModules]: any = useState([
    {
      id: '1',
      name: 'Module React courses',
      description:
        'Shop-coursesbjhbhsdbchsbchjbsjcb sdcbjhdbchjdb cdbchjsbhjcbhdjsbc dcbhdjsbchjdsbhjcbsdhj cdbchjsdbchjbds cbcdshjbcjhdsbchj sdcbhjdsbcjhsd cbsdjhcbdsjh cbjhsd cbhjdsbchjs bc',
      courseId: '1',
      lessons: [
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
      ],
    },
    {
      id: '2',
      name: 'Module React courses 2',
      description: 'Shop-courses',
      courseId: '1',
    },
  ]);

  return (
    <CoursePartPage
      type={MODULE}
      items={modules}
      setItems={setModules}
      isForm={isForm}
      setIsForm={setIsForm}
    />
  );
}

export default ModulesPage;
