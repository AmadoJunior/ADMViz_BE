//Deps
import React from "react";
import { SelectChangeEvent } from "@mui/material";

export interface IDataset {
  title: string;
  endpoint: string;
  dataKey: string;
}

export enum ChartType {
  LINE = "line",
  BAR = "bar",
  PIE = "pie",
  DOUGHTNUT = "doughnut",
  POLARAREA = "polarArea",
  RADAR = "radar",
}

export interface IDateFilter {
  from: number;
  to: number;
}

export interface IChartContext {
  //State
  chartId: number;
  datasets: IDataset[];
  labelKey: string;
  method: string;
  filter: IDateFilter;
  type: string;
  isActive: boolean;
  apiKey: string;

  //Setters
  setChartId: React.Dispatch<React.SetStateAction<number>>,
  setDatasets: React.Dispatch<React.SetStateAction<IDataset[]>>,
  setLabelKey: React.Dispatch<React.SetStateAction<string>>,
  setMethod: React.Dispatch<React.SetStateAction<string>>,
  setType: React.Dispatch<React.SetStateAction<string>>,
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>,
  setApiKey: React.Dispatch<React.SetStateAction<string>>,
  setFrom: React.Dispatch<React.SetStateAction<number>>,
  setTo: React.Dispatch<React.SetStateAction<number>>,

  //Form Handlers
  handleApiKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLabelKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMethod: (e: SelectChangeEvent<string>) => void;
  handleType: (e: SelectChangeEvent<string>) => void;
  onSubmit: () => void;

  //Helpers
  handleNewDataset: (newData: IDataset) => void;
  handleDeleteDataset: (title: string) => void;
  handleIsActive: (b: boolean) => void;
}
