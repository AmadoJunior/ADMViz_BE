//Deps
import React from "react";

//MUI
import {Box} from "@mui/material";

//Components

//Props
interface IDashboardGridProps {
  children?: React.ReactNode;
}

const DashboardGrid: React.FC<IDashboardGridProps> = (props): JSX.Element => {
  return (
    <Box >
      {props?.children}
    </Box>
  );
}

export default DashboardGrid;
