import ModuleInterface from "./ModuleInterface";
import { ModuleActionType } from "../enums/ModuleActionTypeEnum";

export default interface ModuleActionInterface {
  type: ModuleActionType;
  payload: ModuleInterface;
}
