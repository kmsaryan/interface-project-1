import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log(`[SOCKET LOG]: Connected to server with ID: ${socket.id}`);
});

socket.on("disconnect", () => {
  console.log(`[SOCKET LOG]: Disconnected from server`);
});

socket.onAny((event, ...args) => {
  console.log(`[SOCKET EVENT]: ${event}`, args);
});

export default socket;