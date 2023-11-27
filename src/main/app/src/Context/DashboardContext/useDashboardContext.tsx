//Deps
import {createContext, useState} from "react";

//Interfaces
import { IDashboardContext } from "./interfaces";

//Context
export const DashboardContext = createContext<IDashboardContext>({
  //State
  dashboardId: 0,
  title: "",
  charts: [],
  userId: 0,

  //Setters
  setDashboardId: () => {},
  setUserId: () => {},
  setTitle: () => {},
  setCharts: () => {},

  //Helpers
});

const useDashboardContext = (): IDashboardContext => {
  //State
  const [dashboardId, setDashboardId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [charts, setCharts] = useState<number[]>([]);

  return {
    //State
    dashboardId,
    userId,
    title,
    charts,

    //Setters
    setDashboardId,
    setUserId,
    setTitle,
    setCharts,

    //Helpers
  };
}

export default useDashboardContext;
