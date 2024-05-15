import styles from './ModulesItem.module.css';
import ReadyModule from '../ReadyModule/ReadyModule';
import { useState } from 'react';
import EditModule from '../EditModule/EditModule';

function ModulesItem({ modules, setModules, module, key, onDelete }: any) {
  const [isEdit, setIsEdit]: any = useState(false);
  const [description, setDescription] = useState(module.description);
  const [title, setTitle] = useState(module.name);
  return (
    <div className={styles.modulesItem}>
      <div className={styles.module}>
        {!isEdit && (
          <ReadyModule
            module={module}
            onDelete={onDelete}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
          />
        )}
        {isEdit && (
          <EditModule
            description={description}
            setDescription={setDescription}
            title={title}
            setTitle={setTitle}
            onDelete={onDelete}
            setIsEdit={setIsEdit}
            isEdit={isEdit}
            setModules={setModules}
          />
        )}
      </div>
    </div>
  );
}

export default ModulesItem;
