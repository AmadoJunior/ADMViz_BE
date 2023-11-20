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

export interface ICharStyles {
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
}

export interface IDateFilter {
  from: number;
  to: number;
}

export interface IChartParams {
  datasets: IDataset[];
  labelKey: string;
  method: string;
  filter: IDateFilter;
  type: string;
  styles: ICharStyles;
  auth: string | null;
}

export interface IChartFromContext {
  datasets: IDataset[];
  chartParams: IChartParams | null;
  labelKey: string;
  expanded: boolean;
  setExpanded: (state: boolean) => void;
  method: string;
  filter: {
    from: number;
    to: number;
  };
  type: string;
  isActive: boolean;
  apiKey: string;
  handleApiKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLabelKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewDataset: (newData: IDataset) => void;
  handleDeleteDataset: (title: string) => void;
  handleMethod: (e: SelectChangeEvent<string>) => void;
  handleType: (e: SelectChangeEvent<string>) => void;
  handleFrom: (n: number) => void;
  handleTo: (n: number) => void;
  handleIsActive: (b: boolean) => void;
  onSubmit: () => void;
  handleCachedChartParams: (cachedChartParams: IChartParams) => void;
}
