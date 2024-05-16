import { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';
import styles from './ModuleForm.module.css';

function ModuleForm({ modules, id, setModules, isForm, setIsForm }: any) {
  const initialStateModule = {
    id: modules.length + 1,
    name: '',
    description: '',
    courseId: '1', //? как связать с курсом ?
  };
  const [newModule, setNewModule] = useState(initialStateModule);

  const handleEditModule = (id: any) => {
    setModules((prevModules: any) => {
      return prevModules.map((module: any) => {
        if (module.id === id) {
          // Возвращаем обновлённого пользователя с новыми данными, кроме id
          return { ...module, ...newModule, id: module.id };
        } else {
          // Возвращаем неизменённого пользователя
          return module;
        }
      });
    });
  };

  const handleAddModule = () => {
    setModules((prevModules: any) => [
      ...prevModules,
      { ...newModule, id: modules.length + 1 },
    ]);
  };

  const handleResetForm = () => {
    setNewModule(initialStateModule);
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
          <h3>Create a new module</h3>
        </div>
        <div className={styles.labelInputContainer}>
          <Label text="Module title" />
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
        </div>
        <div className={styles.labelInputContainer}>
          <Label text="Module description" />
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
        </div>

        <Button
          text="Save"
          onClick={() => {
            handleResetForm();
            setIsForm(!isForm);
            id ? handleEditModule(id) : handleAddModule();
          }}
        />
      </form>
    </div>
  );
}
export default ModuleForm;
