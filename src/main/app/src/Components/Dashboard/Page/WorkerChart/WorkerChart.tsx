//Deps
import { useMemo, useEffect, useState, useContext, useRef } from "react";

//MUI
import { Box, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

//Components
import AbstractChart from "./AbstractChart/AbstractChart";
import ChartSettings from "./ChartSettings/ChartSettings";
import CustomIconButton from "../../../Utility/IconButton/IconButton";

//Context
import { DashboardContext } from "../../../../Context/DashboardContext/useDashboardContext";

//Interfaces
import {
  ChartType, IChartDetails,
} from "../../../../Context/DashboardContext/interfaces";
import { IChartData } from "./AbstractChart/AbstractChart";

//Props
interface IWorkerChartProps {
  name: string;
  children?: React.ReactNode;
  chartId: number;
  chartDetails: IChartDetails;
}

const WorkerChart: React.FC<IWorkerChartProps> = ({
  name,
  chartId,
  chartDetails
}): JSX.Element => {
  //Worker Status
  const [workerStatus, setWorkerStatus] = useState(200);
  const [workerError, setWorkerError] = useState(false);

  //Chart Worker
  const worker = useMemo(
    () => new Worker(new URL("./WorkerScript/worker.ts", import.meta.url)),
    []
  );

  //Data
  const [isActive, setIsActive] = useState<boolean>(false);
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
    if (chartDetails) {
      worker.postMessage({
        srcUrl: chartDetails.srcUrl,
        dataKey: chartDetails.dataKey,
        labelKey: chartDetails.labelKey,
        method: chartDetails.method,
        filter: chartDetails.filter,
        type: chartDetails.type,
        apiKey: chartDetails.apiKey,
      });
    }
  }, [chartDetails, worker]);

  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: isActive ? "column" : "row",
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
          <Typography variant="overline">{name}</Typography>
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
              setIsActive(prev => !prev)
            }
          >
            <SettingsIcon />
          </CustomIconButton>
        </Box>
        <ChartSettings chartId={chartId} isActive={isActive} setIsActive={setIsActive}/>
        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          {!isActive ? (
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
                type={chartDetails.type as ChartType}
                data={chartData}
              />
            )
          ) : null}
        </Box>
      </Box>
  );
};

export default WorkerChart;
