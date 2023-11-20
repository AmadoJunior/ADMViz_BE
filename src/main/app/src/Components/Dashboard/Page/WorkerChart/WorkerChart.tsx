//Deps
import { useMemo, useEffect, useState, useContext, useRef } from "react";

import { WebSocketContext } from "../../../../Context/WebsocketContext/useWebsocketContext";

//MUI
import { Box, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

//Components
import AbstractChart from "./AbstractChart/AbstractChart";
import ChartSettings from "./ChartSettings/ChartSettings";
import CustomIconButton from "../../../Utility/IconButton/IconButton";

//Context
import { ChartFormContext } from "../../../../Context/ChartFormContext/useChartFormContext";
import useChartFormContext from "../../../../Context/ChartFormContext/useChartFormContext";

//Interfaces
import {
  ChartType,
  IChartParams,
} from "../../../../Context/ChartFormContext/interfaces";
import { IChartData } from "./AbstractChart/AbstractChart";

//Props
interface IWorkerChartProps {
  title: string;
  children?: React.ReactNode;
  moduleId: string;
}

const WorkerChart: React.FC<IWorkerChartProps> = ({
  title,
  moduleId,
}): JSX.Element => {
  //Web Socket
  const webSocketContext = useContext(WebSocketContext);
  const [workerStatus, setWorkerStatus] = useState(200);
  const [workerError, setWorkerError] = useState(false);

  //Chart Form Context
  const chartFromContext = useChartFormContext(moduleId);
  const chartParamsRef = useRef<IChartParams | null>(null);
  chartParamsRef.current = chartFromContext?.chartParams;

  //Chart Worker
  const worker = useMemo(
    () => new Worker(new URL("./WorkerScript/worker.ts", import.meta.url)),
    []
  );
  const [chartData, setChartData] = useState<IChartData>({
    labels: [],
    datasets: [],
  });

  //Effects
  useEffect(() => {
    worker.onmessage = ({ data }) => {
      const { status, chartData } = data;
      console.log(status);
      setWorkerStatus(status);
      if (status === 200) {
        setWorkerError(false);
        setChartData(chartData);
      } else {
        setWorkerError(true);
        setChartData({
          labels: [],
          datasets: [],
        });
      }
      return () => worker.terminate();
    };

    return () => {
      worker.onmessage = null;
    };
  }, [worker]);

  useEffect(() => {
    if (webSocketContext?.isConnected) {
      const onUpdate = () => {
        worker.postMessage({
          ...chartParamsRef?.current,
        });
      };

      webSocketContext?.socket?.on(
        webSocketContext?.webSocketUpdateEvent,
        onUpdate
      );

      return () => {
        webSocketContext?.socket?.off(
          webSocketContext?.webSocketUpdateEvent,
          onUpdate
        );
      };
    }
  }, [webSocketContext?.isConnected]);

  useEffect(() => {
    const chartParams = localStorage.getItem(`chartParams:${moduleId}`);
    if (chartFromContext.chartParams?.datasets?.length) {
      worker.postMessage({
        ...chartFromContext.chartParams,
      });
    } else if (chartParams) {
      chartFromContext.handleCachedChartParams(JSON.parse(chartParams));
    }
  }, [chartFromContext?.chartParams?.datasets, worker]);

  return (
    <ChartFormContext.Provider value={chartFromContext}>
      <Box
        sx={{
          display: "flex",
          flexDirection: chartFromContext.isActive ? "column" : "row",
          width: "100%",
          height: "100% !important",
          padding: "20px 20px 20px 20px",
          backgroundColor: "background.default",
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "#302f2f",
          boxShadow: 6,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "0px",
            left: "50%",
            padding: "5px",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="overline">{title}</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            position: "absolute",
            right: "8px",
            top: "8px",
            zIndex: "3 !important",
          }}
        >
          <CustomIconButton
            title="Settings"
            handler={() =>
              chartFromContext.handleIsActive(!chartFromContext.isActive)
            }
          >
            <SettingsIcon />
          </CustomIconButton>
        </Box>
        <ChartSettings />
        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          {!chartFromContext.isActive ? (
            workerError ? (
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  width: "100%",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "background.paper",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: "#302f2f",
                }}
              >
                <Typography width="150px" color="error" gutterBottom>
                  Worker Error:{" "}
                </Typography>
                <Typography>{workerStatus}</Typography>
              </Box>
            ) : (
              <AbstractChart
                type={chartFromContext.chartParams?.type as ChartType}
                data={chartData}
              />
            )
          ) : null}
        </Box>
      </Box>
    </ChartFormContext.Provider>
  );
};

export default WorkerChart;
