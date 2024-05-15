import ModulesList from '../../components/ModulesList/ModuleList';
import React, { useState } from 'react';
import styles from './ModulesPage.module.css';
import ModuleForm from '../../components/ModuleForm/ModuleForm';

//const tg = window.Telegram.WebApp;

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

  return (
    <div className={styles.container}>
      <ModulesList modules={modules} setModules={setModules} />
      <ModuleForm modules={modules} setModules={setModules} />
    </div>
  );
}

//{!isEdit && tg.MainButton.show()}

export default ModulesPage;
