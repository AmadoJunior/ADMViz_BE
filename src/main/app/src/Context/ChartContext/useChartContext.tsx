//Deps
import React, { createContext, useState } from "react";
import { DateTime } from "luxon";

//MUI
import { SelectChangeEvent } from "@mui/material";

//Interfaces
import {
  IDataset,
  IChartContext,
  ChartType,
} from "./interfaces";

//Default State
export const ChartContext = createContext<IChartContext>({
  //State
  chartId: 0,
  datasets: [] as IDataset[],
  labelKey: "",
  method: "GET",
  filter: {
    from: 0,
    to: Date.now(),
  },
  type: "bar",
  isActive: false,
  apiKey: "",

  //Setters
  setChartId: () => {},
  setDatasets: () => {},
  setLabelKey: () => {},
  setMethod: () => {},
  setType: () => {},
  setIsActive: () => {},
  setApiKey: () => {},
  setFrom: () => {},
  setTo: () => {},

  //Form Handlers
  handleApiKey: (e: React.ChangeEvent<HTMLInputElement>) => {},
  handleLabelKey: (e: React.ChangeEvent<HTMLInputElement>) => {},
  handleMethod: (e: SelectChangeEvent<string>) => {},
  handleType: (e: SelectChangeEvent<string>) => {},
  onSubmit: (): void => {},

  //Helpers
  handleNewDataset: (newData: IDataset) => {},
  handleDeleteDataset: (title: string) => {},
  handleIsActive: (b: boolean) => {},
});

const useChartContext = (dashboardId: number): IChartContext => {
  //State
  const [chartId, setChartId] = useState<number>(0);
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

  //Form Handlers
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

  //Helpers
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

  const handleIsActive = (b: boolean) => {
    setIsActive(b);
  };

  const onSubmit = () => {
    setIsActive(false);
    // localStorage.setItem(
    //   `chartParams:${moduleId}`,
    //   JSON.stringify({
    //     datasets,
    //     labelKey,
    //     method,
    //     filter: { from, to },
    //     type,
    //     styles: {
    //       backgroundColor: "#1976d2",
    //       borderColor: "#1976d2",
    //       borderWidth: 1,
    //     },
    //     auth: apiKey,
    //   })
    // );
    setDatasets(datasets);
    setLabelKey(labelKey);
    setMethod(method);
    setFrom(from);
    setTo(to);
    setType(type);
    setApiKey(apiKey);
  };

  return {
    //State
    chartId,
    datasets,
    method,
    labelKey,
    filter: {
      from,
      to,
    },
    apiKey,
    type,
    isActive,

    //Setters
    setChartId,
    setDatasets,
    setLabelKey,
    setMethod,
    setType,
    setIsActive,
    setApiKey,
    setFrom,
    setTo,

    //Form Handlers
    handleApiKey,
    handleLabelKey,
    handleMethod,
    handleType,
    onSubmit,

    //Helpers
    handleNewDataset,
    handleDeleteDataset,
    handleIsActive,
  };
};

export default useChartContext;
