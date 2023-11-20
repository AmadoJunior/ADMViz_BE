//Deps
import React, { useContext } from "react";
import { Box } from "@mui/material";
import { useDrop } from "react-dnd";

//Components
import Module from "./Module/Module";
import WorkerChart from "./WorkerChart/WorkerChart";

//Constants
import { GUTTER_SIZE } from "../../../constants";

//Context
import { ScreenContext } from "../../../Context/ScreenContext/useScreenContext";
import { ModuleContext } from "../../../Context/ModuleContext/useModuleContext";

const Page = () => {
  //State
  const screenContext = useContext(ScreenContext);
  const moduleContext = useContext(ModuleContext);

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
        ...moduleContext.modules.map(({ coord: { y, h } }) => y + h),
        screenContext.height
      ) +
      GUTTER_SIZE * 2
    );
  }, [moduleContext.modules]);

  //Render
  return (
    <Box
      ref={containerRef}
      position="relative"
      width="100%"
      height={containerHeight}
      sx={{
        display: "flex",
        transition: "height 0.2s",
      }}
    >
      {moduleContext.modules.map((module) => (
        <Module key={module.id} data={module}>
          <WorkerChart moduleId={module.id} title={module.title}></WorkerChart>
        </Module>
      ))}
    </Box>
  );
};

export default React.memo(Page);
