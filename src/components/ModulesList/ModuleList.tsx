import ModulesItem from '../ModulesItem/ModulesItem';

function ModulesList({ modules, setModules }: any) {
  function deleteModule(id: any) {
    setModules(modules.filter((module: any) => module.id !== id));
  }

  return (
    <>
      {modules.map((el: any) => (
        <ModulesItem
          setModules={setModules}
          module={el}
          onDelete={() => deleteModule(el.id)}
        />
      ))}
    </>
  );
}

export default ModulesList;
