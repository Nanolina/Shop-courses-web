import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { LESSONS, MODULES } from '../../consts';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './CoursePartForm.module.css';

function CoursePartForm({
  type,
  modules,
  id,
  setModules,
  isForm,
  setIsForm,
  lessons,
  setLessons,
}: any) {
  const initialStateModule = {
    id: modules.length + 1,
    name: '',
    description: '',
    courseId: '1', //? как связать с курсом ?
  };
  const initialStateLesson = {
    id: lessons.length + 1,
    name: '',
    description: '',
    courseId: '1',
    ModuleId: '1', //? как связать с модулем ?
  };

  const [newModule, setNewModule] = useState(initialStateModule);
  const [newLesson, setNewLesson] = useState(initialStateLesson);

  const moduleType = type === MODULES;
  const lessonType = type === LESSONS;

  const handleEditPart = (id: any) => {
    if (moduleType) {
      setModules((prevModules: any) => {
        return prevModules.map((module: any) => {
          if (module.id === id) {
            return { ...module, ...newModule, id: module.id };
          } else {
            return module;
          }
        });
      });
    } else if (lessonType) {
      setLessons((prevLessons: any) => {
        return prevLessons.map((lesson: any) => {
          if (lesson.id === id) {
            return { ...lesson, ...newLesson, id: lesson.id };
          } else {
            return lesson;
          }
        });
      });
    }
  };

  const handleAddPart = () => {
    if (moduleType) {
      setModules((prevModules: any) => [
        ...prevModules,
        { ...newModule, id: modules.length + 1 },
      ]);
    } else if (lessonType) {
      setLessons((prevLessons: any) => [
        ...prevLessons,
        { ...newLesson, id: lessons.length + 1 },
      ]);
    }
  };

  const handleResetForm = () => {
    if (moduleType) {
      setNewModule(initialStateModule);
    } else if (lessonType) {
      setNewLesson(initialStateLesson);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formMod}>
        <div className={styles.header}>
          <RxCross2
            className={styles.cross}
            size={20}
            color="var(--tg-theme-accent-text-color)"
            onClick={() => setIsForm(!isForm)}
          />
          {moduleType && <h3>Create a new module</h3>}
          {lessonType && <h3>Create a new lesson</h3>}
        </div>
        <div className={styles.labelInputContainer}>
          {moduleType && <Label text="Module title" />}
          {lessonType && <Label text="Lesson title" />}
          {moduleType && (
            <TextInput
              value={newModule.name}
              placeholder="Enter the module title"
              onChange={(event: any) =>
                setNewModule((prevState) => ({
                  ...prevState,
                  name: event.target.value,
                }))
              }
            />
          )}
          {lessonType && (
            <TextInput
              value={newLesson.name}
              placeholder="Enter the lesson title"
              onChange={(event: any) =>
                setNewLesson((prevState) => ({
                  ...prevState,
                  name: event.target.value,
                }))
              }
            />
          )}
        </div>
        <div className={styles.labelInputContainer}>
          {moduleType && <Label text="Module description" />}
          {lessonType && <Label text="Lesson description" />}
          {moduleType && (
            <Textarea
              value={newModule.description}
              placeholder="Enter the module description"
              onChange={(event: any) =>
                setNewModule((prevState) => ({
                  ...prevState,
                  description: event.target.value,
                }))
              }
            />
          )}
          {lessonType && (
            <Textarea
              value={newLesson.description}
              placeholder="Enter the lesson description"
              onChange={(event: any) =>
                setNewLesson((prevState) => ({
                  ...prevState,
                  description: event.target.value,
                }))
              }
            />
          )}
        </div>
        <Button
          text="Save"
          onClick={() => {
            handleResetForm();
            setIsForm(!isForm);
            id ? handleEditPart(id) : handleAddPart();
          }}
        />
      </form>
    </div>
  );
}
export default CoursePartForm;
