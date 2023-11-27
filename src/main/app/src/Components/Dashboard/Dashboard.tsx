//Deps
import React, {useEffect} from "react";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

//MUI
import {Box, Typography} from "@mui/material";

//Components
import ChartFactory from "./ChartFactory/ChartFactory";
import Page from "./Page/Page";
import WebSocket from "./WebSocket/WebSocket";

//Context
import useWebsocketContext, {WebSocketContext} from "../../Context/WebsocketContext/useWebsocketContext";
import useModuleContext, {ModuleContext} from "../../Context/ModuleContext/useModuleContext";
import useChartContext, {ChartContext} from "../../Context/ChartContext/useChartContext";

//Props
interface IDashboardProps {
  title: string,
  id: number,
  children?: React.ReactNode;
}

const Dashboard: React.FC<IDashboardProps> = ({title, id}): JSX.Element => {
  //Context Hooks
  const websocketContext = useWebsocketContext();
  const moduleContext = useModuleContext();
  const chartContext = useChartContext(id);

  //Effect
  useEffect(() => {
    if(websocketContext?.socket){
      websocketContext?.socket.on('connect',websocketContext?. onConnect);
      websocketContext?.socket.on('disconnect', websocketContext?.onDisconnect);
      return () => {
        websocketContext?.socket?.off('connect', websocketContext?.onConnect);
        websocketContext?.socket?.off('disconnect', websocketContext?.onDisconnect);
      }
    }
  }, [websocketContext?.socket])

  return (
    <Box sx={{
      height: "100%",
      width: "100%",
      overflowX: "hidden",
    }}>
      <ChartContext.Provider value={chartContext}>
        <WebSocketContext.Provider value={websocketContext}>
          <ModuleContext.Provider value={moduleContext}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "20px",
              padding: "10px",
              width: "100%",
              
              backgroundColor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "secondary.main"
            }}>
              <Typography variant="h6" padding="0px 20px 0px 20px" color="primary.main">{title}</Typography>
              <WebSocket></WebSocket>
              <ChartFactory></ChartFactory>
            </Box>
            <DndProvider backend={HTML5Backend}>
              
                <Page />
              
            </DndProvider>
          </ModuleContext.Provider>
        </WebSocketContext.Provider>
      </ChartContext.Provider>
    </Box>
  );
}

export default Dashboard;
