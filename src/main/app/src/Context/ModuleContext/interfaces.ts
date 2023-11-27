//Deps

export interface IModuleInterface {
  id: number;
  dashboardId: number,
  chartId: number;
  title: string;
  coord: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface IModuleContext {
  modules: IModuleInterface[];
  addModule: (newModule: IModuleInterface) => void;
  updateModule: (updateModule: IModuleInterface) => void;
  removeModule: (toRemove: IModuleInterface) => void;
}
