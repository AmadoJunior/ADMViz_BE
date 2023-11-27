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
import { ChartContext } from "../../../../Context/ChartContext/useChartContext";
import useChartContext from "../../../../Context/ChartContext/useChartContext";

//Interfaces
import {
  ChartType,
} from "../../../../Context/ChartContext/interfaces";
import { IChartData } from "./AbstractChart/AbstractChart";

//Props
interface IWorkerChartProps {
  title: string;
  children?: React.ReactNode;
  chartId: number;
}

const WorkerChart: React.FC<IWorkerChartProps> = ({
  title,
  chartId,
}): JSX.Element => {
  //Web Socket
  const webSocketContext = useContext(WebSocketContext);
  const [workerStatus, setWorkerStatus] = useState(200);
  const [workerError, setWorkerError] = useState(false);

  //Chart Form Context
  const chartContext = useContext(ChartContext);

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
          datasets: chartContext.datasets,
          labelKey: chartContext.labelKey,
          method: chartContext.method,
          filter: chartContext.filter,
          type: chartContext.type,
          styles: {
            backgroundColor: "#1976d2",
            borderColor: "#1976d2",
            borderWidth: 1,
          },
          auth: chartContext.apiKey,
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
    if (chartContext.datasets?.length) {
      worker.postMessage({
        datasets: chartContext.datasets,
        labelKey: chartContext.labelKey,
        method: chartContext.method,
        filter: chartContext.filter,
        type: chartContext.type,
        styles: {
          backgroundColor: "#1976d2",
          borderColor: "#1976d2",
          borderWidth: 1,
        },
        auth: chartContext.apiKey,
      });
    }
  }, [chartContext?.datasets, worker]);

  return (
    <ChartContext.Provider value={chartContext}>
      <Box
        sx={{
          display: "flex",
          flexDirection: chartContext.isActive ? "column" : "row",
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
              chartContext.handleIsActive(!chartContext.isActive)
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
          {!chartContext.isActive ? (
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
                type={chartContext.type as ChartType}
                data={chartData}
              />
            )
          ) : null}
        </Box>
      </Box>
    </ChartContext.Provider>
  );
};

export default WorkerChart;
