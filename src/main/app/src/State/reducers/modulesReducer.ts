import ModuleInterface from "../actions/interfaces/ModuleInterface";
import ModuleActionInterface from "../actions/interfaces/ModuleActionInterface";
import { ModuleActionType } from "../actions/enums/ModuleActionTypeEnum";

const initialState: ModuleInterface[] = [];

const reducer = (
  state: ModuleInterface[] = initialState,
  action: ModuleActionInterface
) => {
  switch (action.type) {
    case ModuleActionType.ADD_MODULE:
      return [...state, action.payload];
    case ModuleActionType.REMOVE_MODULE:
      return state.filter((value) => value.id !== action.payload.id);
    case ModuleActionType.UPDATE_MODULE:
      return state.map((data) => {
        if (data.id === action.payload.id) {
          return { ...action.payload };
        } else {
          return { ...data };
        }
      });
    default:
      return state;
  }
};

export default reducer;
