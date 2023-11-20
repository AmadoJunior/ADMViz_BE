//Deps
import React, {useContext, useState} from "react";

//MUI
import {Box, Typography, Button} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//Context
import { WebSocketContext } from "../../../Context/WebsocketContext/useWebsocketContext";

//Components
import CustonInput from "../../Utility/CustomInput/CustomInput";
import CustomIconButton from "../../Utility/IconButton/IconButton";

//Props
interface IWebSocketProps {
  children?: React.ReactNode;
}

const WebSocket: React.FC<IWebSocketProps> = (props): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const webSocketContext = useContext(WebSocketContext);

  const handleConnect = () => {
    webSocketContext?.handleConnect();
    setExpanded(false);
  }

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Typography sx={{
        marginRight: "20px"
      }}>Web Socket Status: 
        <span style={{
          color: webSocketContext?.isConnected ? theme.palette.success.light: theme.palette.error.light
        }}>{webSocketContext?.isConnected ? " Connected": " Disconnected"}</span>
      </Typography>
      <CustomIconButton
        title="Settings"
        handler={() => setExpanded((prev) => (!prev))}
      >
        <SettingsIcon/>
      </CustomIconButton>
        <Dialog open={expanded} onClose={() => setExpanded((prev) => !prev)} PaperProps={{
          elevation: 0,
          sx: {
            padding: "20px",
            borderRadius: "10px",
            border: "solid 1px",
            borderColor: "secondary.main"
          }
        }}>
        <DialogTitle>Web Socket Connection</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            The Socket.io connection listens for an update event and triggers a reload. It does not send or receive chart data.
          </DialogContentText>
          <CustonInput title="End Point" handler={webSocketContext?.handleWebSocketEndpoint} value={webSocketContext?.webSocketEndpoint}></CustonInput>
          <CustonInput title="Authentication Key" handler={webSocketContext?.handleWebSocketKey} value={webSocketContext?.webSocketKey}></CustonInput>
          <CustonInput title="Update Event Name" handler={webSocketContext?.handleWebSocketUpdateEvent} value={webSocketContext?.webSocketUpdateEvent}></CustonInput>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setExpanded(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConnect}>Connect</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WebSocket;
