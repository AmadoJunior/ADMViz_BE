import ModuleInterface from "../interfaces/ModuleInterface";
import { ModuleActionType } from "../enums/ModuleActionTypeEnum";
import { Dispatch } from "@reduxjs/toolkit";
import ModuleActionInterface from "../interfaces/ModuleActionInterface";

export const addModule = (newModule: ModuleInterface) => {
  return (dispatch: Dispatch<ModuleActionInterface>) => {
    dispatch({
      type: ModuleActionType.ADD_MODULE,
      payload: newModule,
    });
  };
};

export const removeModule = (module: ModuleInterface) => {
  return (dispatch: Dispatch<ModuleActionInterface>) => {
    dispatch({
      type: ModuleActionType.REMOVE_MODULE,
      payload: module,
    });
  };
};

export const updateModule = (updatedModule: ModuleInterface) => {
  return (dispatch: Dispatch<ModuleActionInterface>) => {
    dispatch({
      type: ModuleActionType.UPDATE_MODULE,
      payload: updatedModule,
    });
  };
};
