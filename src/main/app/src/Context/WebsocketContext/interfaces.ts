import { Socket } from "socket.io-client";

export interface IWebSocketContext {
  socket: Socket | undefined;
  isConnected: boolean;
  webSocketUpdateEvent: string;
  webSocketKey: string;
  webSocketEndpoint: string;
  handleWebSocketEndpoint: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWebSocketKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWebSocketUpdateEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  handleConnect: () => void;
}
