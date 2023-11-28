export enum ChartType {
  LINE = "line",
  BAR = "bar",
  PIE = "pie",
  DOUGHTNUT = "doughnut",
  POLARAREA = "polarArea",
  RADAR = "radar",
}

export interface IChartPosition {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface IDateFilter {
  from: number;
  to: number;
}

export interface IChartDetails {
  name: string;
  srcUrl: string;
  dataKey: string;
  labelKey: string;
  type: string;
  method: string;
  apiKey: string;
  filter: IDateFilter;
}

export interface IChart {
  chartId: number;
  details: IChartDetails;
  position: IChartPosition;
}

export interface IDashboardContext {
  //State
  userId: number,
  dashboardId: number,
  name: string,
  charts: IChart[],

  //Setters
  setDashboardId: React.Dispatch<React.SetStateAction<number>>,
  setName: React.Dispatch<React.SetStateAction<string>>,
  setCharts: React.Dispatch<React.SetStateAction<IChart[]>>,

  //Helpers
  insertChart: (chartDetails: IChartDetails) => void,
  removeChart: (chartId: number) => void,
  updateChartDetails: (chartId: number, chartDetails: IChartDetails) => void,
  updateChartPosition: (chartId: number, chartPosition: IChartPosition) => void,
}