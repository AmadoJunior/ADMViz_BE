//Deps
import React, { createContext, useState } from "react";
import { DateTime } from "luxon";

//MUI
import { SelectChangeEvent } from "@mui/material";

//Interfaces
import {
  IDataset,
  IChartParams,
  IChartFromContext,
  ChartType,
} from "./interfaces";

//Context
export const ChartFormContext = createContext<IChartFromContext>({
  datasets: [] as IDataset[],
  chartParams: null,
  labelKey: "",
  expanded: false,
  method: "GET",
  filter: {
    from: 0,
    to: Date.now(),
  },
  type: "bar",
  isActive: false,
  apiKey: "",
  setExpanded: (state: boolean): void => {},
  handleApiKey: (e: React.ChangeEvent<HTMLInputElement>): void => {},
  handleLabelKey: (e: React.ChangeEvent<HTMLInputElement>): void => {},
  handleNewDataset: (newData: IDataset): void => {},
  handleDeleteDataset: (title: string): void => {},
  handleMethod: (e: SelectChangeEvent<string>): void => {},
  handleType: (e: SelectChangeEvent<string>): void => {},
  handleFrom: (n: number): void => {},
  handleTo: (n: number): void => {},
  handleIsActive: (b: boolean): void => {},
  onSubmit: (): void => {},
  handleCachedChartParams: (cachedChartParams: IChartParams) => {},
});

const useChartFormContext = (moduleId: string): IChartFromContext => {
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  const [labelKey, setLabelKey] = useState<string>("");
  const [method, setMethod] = useState<string>("GET");
  const [from, setFrom] = useState<number>(
    DateTime.now().minus({ months: 1 }).toMillis()
  );
  const [to, setTo] = useState<number>(
    DateTime.now().plus({ days: 1 }).toMillis()
  );
  const [type, setType] = useState<string>(ChartType.LINE);
  const [apiKey, setApiKey] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [chartParams, setChartParams] = useState<IChartParams | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleFrom = (n: number) => {
    setFrom(n);
  };

  const handleTo = (n: number) => {
    setTo(n);
  };

  const handleNewDataset = (newData: IDataset) => {
    setDatasets((prev) => {
      return [...prev, newData];
    });
  };

  const handleDeleteDataset = (title: string) => {
    setDatasets((prev) => {
      return prev.filter((value) => value.title !== title);
    });
  };

  const handleLabelKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLabelKey(e?.currentTarget?.value);
  };

  const handleApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setApiKey(e?.currentTarget?.value);
  };

  const handleMethod = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setMethod(e.target.value);
  };

  const handleType = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    setType(e.target.value);
  };

  const handleIsActive = (b: boolean) => {
    setIsActive(b);
  };

  const handleCachedChartParams = (cachedChartParams: IChartParams) => {
    const { datasets, labelKey, method, filter, type, auth } =
      cachedChartParams;
    console.log(cachedChartParams);
    setFrom(filter.from);
    setTo(filter.to);
    setDatasets(datasets);
    setLabelKey(labelKey);
    setMethod(method);
    setType(type);
    setApiKey(auth || "");

    setChartParams({
      datasets,
      labelKey,
      method,
      filter: { from, to },
      type,
      styles: {
        backgroundColor: "#1976d2",
        borderColor: "#1976d2",
        borderWidth: 1,
      },
      auth: auth,
    });
  };

  const onSubmit = () => {
    setIsActive(false);
    localStorage.setItem(
      `chartParams:${moduleId}`,
      JSON.stringify({
        datasets,
        labelKey,
        method,
        filter: { from, to },
        type,
        styles: {
          backgroundColor: "#1976d2",
          borderColor: "#1976d2",
          borderWidth: 1,
        },
        auth: apiKey,
      })
    );
    setChartParams({
      datasets,
      labelKey,
      method,
      filter: { from, to },
      type,
      styles: {
        backgroundColor: "#1976d2",
        borderColor: "#1976d2",
        borderWidth: 1,
      },
      auth: apiKey,
    });
  };

  return {
    datasets,
    chartParams,
    method,
    labelKey,
    filter: {
      from,
      to,
    },
    expanded,
    apiKey,
    type,
    isActive,
    handleNewDataset,
    handleDeleteDataset,
    handleMethod,
    handleType,
    handleFrom,
    handleTo,
    onSubmit,
    setExpanded,
    handleLabelKey,
    handleApiKey,
    handleIsActive,
    handleCachedChartParams,
  };
};

export default useChartFormContext;
