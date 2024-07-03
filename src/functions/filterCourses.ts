import { ICourse } from '../types';

export function filterCourses(courses: ICourse[], value: String) {
  return courses.filter((course: ICourse) =>
    course.name.toLowerCase().includes(value.toLowerCase())
  );
}
