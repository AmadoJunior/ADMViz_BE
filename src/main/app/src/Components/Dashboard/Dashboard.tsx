//Deps
import React from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

//MUI
import {Box, Typography, Button} from "@mui/material";

//Components
import ChartFactory from "./ChartFactory/ChartFactory";
import Page from "./Page/Page";

//Context
import useDashboardContext, {DashboardContext} from "../../Context/DashboardContext/useDashboardContext";

//Props
interface IDashboardProps {
  dashboardName: string,
  dashboardId: number,
  userId: number,
  children?: React.ReactNode;
}

const Dashboard: React.FC<IDashboardProps> = ({dashboardName, dashboardId, userId}): JSX.Element => {
  //Context
  const dashboardContext = useDashboardContext({userId, dashboardId, dashboardName});
  
  
  return (
    <Box sx={{
      height: "100%",
      width: "100%",
      overflowX: "hidden",
      padding: "10px"
    }}>
      <DashboardContext.Provider value={dashboardContext}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "20px",
              padding: "10px",
              width: "100%",
              
              backgroundColor: "background.paper",
              borderRadius: "5px 5px 0px 0px"
            }}>
              <ChartFactory></ChartFactory>
            </Box>
            <DndProvider backend={HTML5Backend}>
              
                <Page />
              
            </DndProvider>
      </DashboardContext.Provider>
    </Box>
  );
}

export default Dashboard;
