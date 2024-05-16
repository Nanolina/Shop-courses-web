import { LESSONS, MODULES } from '../../consts';
import CoursePartItem from '../CoursePartItem/CoursePartItem';

function CoursePartList({
  type,
  modules,
  setModules,
  lessons,
  setLessons,
}: any) {
  const moduleType = type === MODULES;
  const lessonType = type === LESSONS;

  function deleteModule(id: any) {
    setModules(modules.filter((module: any) => module.id !== id));
  }

  function deleteLesson(id: any) {
    setLessons(lessons.filter((lesson: any) => lesson.id !== id));
  }

  return (
    <>
      {moduleType && (
        <>
          {modules.map((el: any) => (
            <CoursePartItem
              type={type}
              setModules={setModules}
              module={el}
              onDelete={() => deleteModule(el.id)}
            />
          ))}
        </>
      )}
      {lessonType && (
        <>
          {lessons.map((el: any) => (
            <CoursePartItem
              type={type}
              setModules={setModules}
              lesson={el}
              onDelete={() => deleteLesson(el.id)}
            />
          ))}
        </>
      )}
    </>
  );
}

export default CoursePartList;
