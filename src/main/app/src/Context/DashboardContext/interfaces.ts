export interface IDashboardContext {
  //State
  dashboardId: number,
  title: string,
  charts: number[],
  userId: number,

  //Setters
  setDashboardId: React.Dispatch<React.SetStateAction<number>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setCharts: React.Dispatch<React.SetStateAction<number[]>>,
  setUserId: React.Dispatch<React.SetStateAction<number>>,

  //Helpers
}