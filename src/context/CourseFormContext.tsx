import React, { ReactNode, createContext, useContext } from 'react';
import { IUseCourseFormReturnType } from '../pages/types';

const CourseFormContext = createContext<IUseCourseFormReturnType | undefined>(
  undefined
);

export const useCourseFormContext = () => {
  const context = useContext(CourseFormContext);
  if (!context) {
    throw new Error(
      'useCourseFormContext must be used within a CourseFormProvider'
    );
  }
  return context;
};

interface CourseFormProviderProps {
  value: IUseCourseFormReturnType;
  children: ReactNode;
}

export const CourseFormProvider: React.FC<CourseFormProviderProps> = ({
  children,
  value,
}: any) => (
  <CourseFormContext.Provider value={value}>
    {children}
  </CourseFormContext.Provider>
);
