//Deps
import React, {createContext, useState} from "react";
import { io, Socket } from "socket.io-client";

//MUI

//Interfaces
import { IWebSocketContext } from "./interfaces";

//Context
export const WebSocketContext = createContext<IWebSocketContext>({
  socket: undefined,
  isConnected: false,
  webSocketUpdateEvent: "",
  webSocketKey: "",
  webSocketEndpoint: "",
  handleWebSocketEndpoint: (e: React.ChangeEvent<HTMLInputElement>): void => {},
  handleWebSocketKey: (e: React.ChangeEvent<HTMLInputElement>): void => {},
  handleWebSocketUpdateEvent: (e: React.ChangeEvent<HTMLInputElement>): void => {},
  handleConnect: (): void => {},
  onConnect: (): void => {},
  onDisconnect: (): void => {},
});

const useWebsocketContext = (): IWebSocketContext => {
  const [socket, setSocket] = useState<Socket | undefined>();
  const [webSocketEndpoint, setWebSocketEndpoint] = useState("");
  const [webSocketKey, setWebSocketKey] = useState("");
  const [webSocketUpdateEvent, setWebSocketUpdateEvent] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const onConnect = () => {
    setIsConnected(true);
  }

  const onDisconnect = () => {
    setIsConnected(false);
  }

  const handleWebSocketEndpoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setWebSocketEndpoint(e?.currentTarget?.value);
  }
  const handleWebSocketKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setWebSocketKey(e?.currentTarget?.value);
  }
  const handleWebSocketUpdateEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setWebSocketUpdateEvent(e?.currentTarget?.value);
  }

  const handleConnect = () => {
    if(webSocketEndpoint?.length && webSocketKey?.length && webSocketUpdateEvent?.length){
      setSocket(io(webSocketEndpoint, {
        auth: {
          token: webSocketKey,
        },
      }));
    }
  }

  return {
    socket,
    webSocketEndpoint,
    webSocketKey,
    webSocketUpdateEvent,
    isConnected,
    handleWebSocketEndpoint,
    handleWebSocketKey,
    handleWebSocketUpdateEvent,
    onConnect,
    onDisconnect,
    handleConnect
  };
}

export default useWebsocketContext;
