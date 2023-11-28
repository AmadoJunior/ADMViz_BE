//Deps
import React, {createContext, useState} from "react";

//Interfaces
import { IChart, IChartDetails, IChartPosition, IDashboardContext } from "./interfaces";

//Context
export const DashboardContext = createContext<IDashboardContext>({
  //State
  userId: 0,
  dashboardId: 0,
  name: "",
  charts: [],

  //Setters
  setDashboardId: () => {},
  setName: () => {},
  setCharts: () => {},

  //Helpers
  updateChartDetails: (chartId: number, chartDetails: IChartDetails) => {},
  updateChartPosition: (chartId: number, chartPosition: IChartPosition) => {},
  insertChart(chartDetails: IChartDetails) {},
  removeChart(chartId: number) {},
});

interface IDashboardContextHookProps {
  userId: number,
  dashboardId: number,
  dashboardName: string,
}

const useDashboardContext = (props: IDashboardContextHookProps): IDashboardContext => {
  //State
  const [userId, setUserId] = useState(props.userId);
  const [dashboardId, setDashboardId] = useState<number>(props.dashboardId);
  const [name, setName] = useState<string>(props.dashboardName);
  const [charts, setCharts] = useState<IChart[]>([]);

  //Methods
  const updateChartDetails = (chartId: number, chartDetails: IChartDetails) => {
    fetch(`/api/dashboards/${dashboardId}/charts/${chartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chartDetails)
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(e => {
      console.error(e);
    })
  }

  const updateChartPosition = (chartId: number, chartPosition: IChartPosition) => {
    fetch(`/api/dashboards/${dashboardId}/charts/${chartId}/position`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chartPosition)
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(e => {
      console.error(e);
    })
  }

  const insertChart = (chartDetails: IChartDetails) => {
    fetch(`/api/dashboards/${dashboardId}/charts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chartDetails)
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(e => {
      console.error(e);
    })
  }

  const removeChart = (chartId: number) => {
    fetch(`/api/dashboards/${dashboardId}/charts/${chartId}`, {
      method: "DELETE"
    })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(e => {
      console.error(e);
    })
  }

  const getCharts = () => {
    fetch(`/sdr/dashboards/${dashboardId}/charts`, {
      method: "GET"
    })
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      console.log(data);
      if(data?.["_embedded"]?.["charts"]) {
        setCharts(data?.["_embedded"]?.["charts"].map((chart: {
          id: number,
          name: string;
          srcUrl: string;
          dataKey: string;
          labelKey: string;
          chartType: string;
          method: string;
          apiKey: string;
          fromDate: number,
          toDate: number,
          position: IChartPosition,
        }) => {
          return {
            chartId: chart?.id,
            details: {
              name: chart?.name,
              srcUrl: chart?.srcUrl,
              dataKey: chart?.dataKey,
              labelKey: chart?.labelKey,
              chartType: chart?.chartType,
              method: chart?.method,
              apiKey: chart?.apiKey,
              filter: {
                from: chart?.fromDate,
                to: chart?.toDate
              },
            },
            position: chart?.position,
          }
        }));
      }
    })
    .catch(e => {
      console.error(e);
    })
  }

  React.useEffect(() => {
    if(userId && dashboardId) getCharts();
  }, [userId, dashboardId])

  return {
    //State
    userId,
    dashboardId,
    name,
    charts,

    //Setters
    setDashboardId,
    setName,
    setCharts,

    //Helpers
    updateChartDetails,
    updateChartPosition,
    insertChart,
    removeChart,
  };
}

export default useDashboardContext;
