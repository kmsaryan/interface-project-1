//socket.js
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SERVER_URL, {
  transports: ["websocket"], // Ensure WebSocket is used for better reliability
});

socket.on("connect", () => {
  console.log(`[SOCKET LOG]: Connected to server with ID: ${socket.id}`);
});

socket.on("disconnect", (reason) => {
  console.log(`[SOCKET LOG]: Disconnected from server. Reason: ${reason}`);
});

socket.on("connect_error", (error) => {
  console.error(`[SOCKET ERROR]: Connection error`, error);
});

socket.onAny((event, ...args) => {
  console.log(`[SOCKET EVENT]: ${event}`, args);
});

// Add specific logging for chat-related events
socket.on("chat_message", (message) => {
  console.log(`[CHAT EVENT]: Received chat message`, message);
});

socket.on("chat_error", (error) => {
  console.error(`[CHAT ERROR]:`, error);
});

// Wrap emit to log outgoing messages
const originalEmit = socket.emit;
socket.emit = function (event, ...args) {
  console.log(`[SOCKET EMIT]: Event: ${event}`, args);
  originalEmit.apply(socket, [event, ...args]);
};

export default socket;