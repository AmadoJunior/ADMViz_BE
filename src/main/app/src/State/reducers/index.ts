import { combineReducers } from "@reduxjs/toolkit";
import modulesReducer from "./modulesReducer";

const reducers = combineReducers({
  modules: modulesReducer,
});

export default reducers;
