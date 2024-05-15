import React, { useState } from 'react';
// import { LuPlus } from 'react-icons/lu';
import styles from './ModuleForm.module.css';

const rows = 5;

function ModuleForm({ modules, id, setModules }: any) {
  const initialStateModule = {
    id: modules.length + 1,
    name: '',
    description: '',
    courseId: '1', //? как связать с курсом ?
  };
  const [newModule, setNewModule] = useState(initialStateModule);

    // const className = `${styles.form} ${
    //   formMod ? styles.formMod : ''
    // }`;

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
    <form className={styles.formMod }>
      <label>Module title</label>
      <input
        value={newModule.name}
        color="var(--tg-theme-accent-text-color)"
        placeholder="Enter the module title"
        onChange={(event) =>
          setNewModule((prevState) => ({
            ...prevState,
            name: event.target.value,
          }))
        }
      />
      <label>Module description</label>
      <textarea
        value={newModule.description}
        rows={rows}
        color="var(--tg-theme-accent-text-color)"
        placeholder="Enter the module description"
        onChange={(event) =>
          setNewModule((prevState) => ({
            ...prevState,
            description: event.target.value,
          }))
        }
      />

      <button
        color="var(--tg-theme-accent-text-color)"
        type="button"
        onClick={() => {
          handleResetForm();
          id ? handleEditModule(id) : handleAddModule();
        }}
      >
        {' '}
        Save
      </button>
    </form>
  );
}
//<LuPlus color="var(--tg-theme-accent-text-color)" size={20} />
export default ModuleForm;
