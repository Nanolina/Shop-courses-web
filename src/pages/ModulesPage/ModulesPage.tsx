import ModulesList from '../../components/ModulesList/ModuleList';
import React, { useEffect, useState } from 'react';
import styles from './ModulesPage.module.css';
import ModuleForm from '../../components/ModuleForm/ModuleForm';
import Button from '../../ui/Button/Button';

const tg = window.Telegram.WebApp;

function ModulesPage() {
  const [modules, setModules]: any = useState([
    {
      id: '1',
      name: 'Module React courses',
      description: 'Shop-courses',
      courseId: '1',
    },
    {
      id: '2',
      name: 'Module React courses 2',
      description: 'Shop-courses',
      courseId: '1',
    },
  ]);

  const [isForm, setIsForm] = useState(false);

  useEffect(() => {
    const toggleForm = () => {
      setIsForm(!isForm);
    };

    tg.MainButton.setParams({
      text: 'Create new module',
    });
    tg.onEvent('mainButtonClicked', toggleForm);
    return () => tg.offEvent('mainButtonClicked', toggleForm);
  }, [isForm]);

  useEffect(() => {
    if (isForm) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [isForm]);

  return (
    <div className={styles.modPage}>
      <div className={styles.container}>
        <ModulesList modules={modules} setModules={setModules} />
      </div>
      <div>
        {isForm && (
          <ModuleForm
            modules={modules}
            setModules={setModules}
            isForm={isForm}
            setIsForm={setIsForm}
          />
        )}
        {/* {!isForm && (
          <Button
            text="Add a new module"
            color="var(--tg-theme-accent-text-color)"
            onClick={() => {
              setIsForm(() => !isForm);
            }}
          />
        )} */}
      </div>
    </div>
  );
}

//{!isEdit && tg.MainButton.show()}

export default ModulesPage;
