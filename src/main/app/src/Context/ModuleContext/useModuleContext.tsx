//Deps
import React, { createContext, useState } from "react";

//Interfaces
import { IModuleContext, IModuleInterface } from "./interfaces";

//Context
export const ModuleContext = createContext<IModuleContext>({
  modules: [],
  addModule: (newModule: IModuleInterface): void => {},
  updateModule: (updatedModule: IModuleInterface): void => {},
  removeModule: (toRemove: IModuleInterface): void => {},
});

const useModuleContext = (): IModuleContext => {
  //State
  const [modules, setModules] = useState<IModuleInterface[]>([]);

  //Methods
  const addModule = (newModule: IModuleInterface) => {
    localStorage.setItem(`AMADO`, JSON.stringify([...modules, newModule]));
    setModules((prev) => {
      return [...prev, newModule];
    });
  };

  const updateModule = (updatedModule: IModuleInterface) => {
    localStorage.setItem(
      `AMADO`,
      JSON.stringify(
        modules.map((item) => {
          return item.id === updatedModule.id ? updatedModule : item;
        })
      )
    );
    setModules((prev) => {
      return prev.map((item) => {
        return item.id === updatedModule.id ? updatedModule : item;
      });
    });
  };

  const removeModule = (toRemove: IModuleInterface) => {
    localStorage.setItem(
      `AMADO`,
      JSON.stringify([...modules.filter((value) => value.id !== toRemove.id)])
    );
    setModules((prev) => {
      return prev.filter((value) => value.id !== toRemove.id);
    });
  };

  React.useEffect(() => {
    const cachedModules = localStorage.getItem(`AMADO`);
    if (cachedModules) {
      setModules(JSON.parse(cachedModules));
    }
  }, []);

  return {
    modules,
    addModule,
    updateModule,
    removeModule,
  };
};

export default useModuleContext;
