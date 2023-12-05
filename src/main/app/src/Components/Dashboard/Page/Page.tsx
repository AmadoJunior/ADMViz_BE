//Deps
import React, { useContext } from "react";
import { Box, Grid, useTheme } from "@mui/material";
import { useDrop } from "react-dnd";
import { useDraggable } from "react-use-draggable-scroll";
import useSize from './../../../Hooks/useSize';

//Components
import Module from "./Module/Module";
import WorkerChart from "./WorkerChart/WorkerChart";

//Constants
import { COLUMN_WIDTH, GUTTER_SIZE, NAV_HEIGHT } from "../../../constants";

//Context
import { DashboardContext } from "../../../Context/DashboardContext/useDashboardContext";

//Props
interface IPageProps {

}

const Page: React.FC<IPageProps> = ({}) => {
  //Theme
  const theme = useTheme();

  //State
  const dashboardContext = useContext(DashboardContext);
  const [height, setHeight] = React.useState(0);

  // Wire the Module to DnD Drag System
  const [, drop] = useDrop(() => ({
    accept: "module",
  }));

  //Ref
  const containerRef = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLInputElement>;
  const [scrollWidth, scrollHeight] = useSize(containerRef);

  //Setup Drop Container
  drop(containerRef);

  //Setup Draggable Scroll
  const { events } = useDraggable(containerRef, {
    activeMouseButton: "Right"
  });

  //Calc Height
  const containerHeight = React.useMemo(() => {
    return (
      (height - NAV_HEIGHT) +
      GUTTER_SIZE * 2
    );
  }, [dashboardContext?.charts, height]);
  
  //Effects
  React.useEffect(() => {
    // Function to handle the resize event
    const handleResize = () => {
      setHeight(document.documentElement.clientHeight);
    };

    // Set initial height
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //Render
  return (
    <Box
      {...events}
      ref={containerRef}
      position="relative"
      width="100%"
      sx={{
        backgroundColor: "background.default",
        height: `${containerHeight}px`,
        overflow: "scroll",
        cursor: "grab",
        backgroundImage: `linear-gradient(${theme.palette.background.paper} 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.background.paper} 1px, transparent 1px)`,
        backgroundSize: `${COLUMN_WIDTH}px ${COLUMN_WIDTH}px`,
        backgroundAttachment: "local",
      }}
      onContextMenu={(e)=> e.preventDefault()}
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
