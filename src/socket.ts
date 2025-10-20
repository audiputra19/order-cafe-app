import { io } from "socket.io-client";

export const socket = io("http://localhost:3001");
export const socket2 = io("http://localhost:3002");