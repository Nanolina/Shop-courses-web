// Created to know which keys are used in a react-query library application
const queryKeys = {
  // Without auth
  CoursesList: ['allCourses'],
  CoursesOneCategoryPage: ['coursesByOneCategory', 'category'],

  // With auth
  CourseDetailsPage: ['courseDetails', 'courseId'],
  MyCreatedCoursesPage: ['myCreatedCourses', 'initDataRaw'],
  MyPurchasedCoursesPage: ['myPurchasedCourses', 'initDataRaw'],
  ModulesPage: ['modules', 'courseId'],
  LessonsPage: ['lessons', 'moduleId'],
  PointsContext: ['points', 'initDataRaw'],
  EditCoursePartPageModule: ['module', 'moduleId'],
  EditCoursePartPageLessonAndLessonPage: ['lesson', 'lessonId'],
  useUserPage: ['userDetails', 'initDataRaw'],
};
