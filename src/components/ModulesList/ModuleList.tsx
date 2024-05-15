import styles from './ModulesList.module.css';
import ModulesItem from '../ModulesItem/ModulesItem';

function ModulesList({ modules, setModules }: any) {
  return (
    <div className={styles.container}>
      {modules.map((el: any) => (
        <ModulesItem
          modules={modules}
          setModules={setModules}
          key={el.id}
          module={el}
          onDelete={() => deleteModule(el.id)}
        />
      ))}
    </div>
  );
  function deleteModule(id: any) {
    setModules(modules.filter((module: any) => module.id !== id));
  }
}

export default ModulesList;
