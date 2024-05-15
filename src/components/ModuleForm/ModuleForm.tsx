import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import styles from './ModuleForm.module.css';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import TextInput from '../../ui/TextInput/TextInput';
import Textarea from '../../ui/Textarea/Textarea';

const rows = 5;

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
    <form className={styles.formMod}>
      <div className={styles.header}>
        <RxCross2
          className={styles.cross}
          size={20}
          color="var(--tg-theme-accent-text-color)"
          onClick={() => setIsForm(!isForm)}
        />
      </div>
      <h3>Create a new module</h3>
      <Label text="Module title" />
      <TextInput
        value={newModule.name}
        color="var(--tg-theme-accent-text-color)"
        placeholder="Enter the module title"
        onChange={(event: any) =>
          setNewModule((prevState) => ({
            ...prevState,
            name: event.target.value,
          }))
        }
      />
      <Label text="Module description" />
      <Textarea
        value={newModule.description}
        rows={rows}
        color="var(--tg-theme-accent-text-color)"
        placeholder="Enter the module description"
        onChange={(event: any) =>
          setNewModule((prevState) => ({
            ...prevState,
            description: event.target.value,
          }))
        }
      />

      <Button
        text="Save"
        isBlack={true}
        onClick={() => {
          handleResetForm();
          setIsForm(!isForm);
          id ? handleEditModule(id) : handleAddModule();
        }}
      />
    </form>
  );
}
export default ModuleForm;
