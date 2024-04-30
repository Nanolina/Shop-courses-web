import { ICourse } from '../types';

export const groupCoursesByCategory = (
  courses: ICourse[]
): Record<string, ICourse[]> => {
  return courses.reduce<Record<string, ICourse[]>>((acc, course) => {
    acc[course.category] = acc[course.category] || [];
    acc[course.category].push(course);
    return acc;
  }, {});
};
