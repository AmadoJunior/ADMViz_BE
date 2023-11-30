//Deps
import React, { useContext } from "react";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";

//Components
import Module from "./Module/Module";
import WorkerChart from "./WorkerChart/WorkerChart";

//Constants
import { GUTTER_SIZE, NAV_HEIGHT } from "../../../constants";

//Context
import { DashboardContext } from "../../../Context/DashboardContext/useDashboardContext";

//Props
interface IPageProps {

}

const Page: React.FC<IPageProps> = ({}) => {
  //State
  const dashboardContext = useContext(DashboardContext);

  // Wire the Module to DnD Drag System
  const [, drop] = useDrop(() => ({
    accept: "module",
  }));

  //Ref
  const containerRef = React.useRef<HTMLDivElement>();
  drop(containerRef);

  //Calc Height
  const containerHeight = React.useMemo(() => {
    return (
      Math.max(
        ...dashboardContext?.charts?.map(({ position: { y, h } }) => y + h),
        document.documentElement.clientHeight - NAV_HEIGHT
      ) +
      GUTTER_SIZE * 2
    );
  }, [dashboardContext?.charts]);

  console.log(containerHeight)

  //Render
  return (
    <Box
      ref={containerRef}
      position="relative"
      width="100%"
      sx={{
        backgroundColor: "background.default",
        height: `${containerHeight}px`,
        overflow: "clip"
      }}
    >
      {dashboardContext?.charts?.length ? dashboardContext?.charts?.map((chart) => (
        <Module key={`Module${chart?.chartId}`} chartId={chart?.chartId} position={chart?.position}>
          <WorkerChart chartId={chart?.chartId} chartDetails={chart?.details} name={chart?.details?.name}></WorkerChart> 
        </Module>
      )) : null}
    </Box>
  );
};

export default React.memo(Page);
