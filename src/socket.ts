import { io } from "socket.io-client";
import { BASE_URL, BASE_URL_ADMIN } from "./components/BASE_URL";

export const socket = io(BASE_URL_ADMIN);
export const socket2 = io(BASE_URL);