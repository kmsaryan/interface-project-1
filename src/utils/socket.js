//socket.js
import { io } from "socket.io-client";

// Ensure the WebSocket client points to the correct server URL
const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
console.log(`[SOCKET LOG]: Attempting to connect to WebSocket server at ${serverUrl}`);

const socket = io(serverUrl, {
  transports: ["websocket"], // Ensure WebSocket is used for better reliability
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 10, // Retry up to 10 times
  timeout: 20000, // 20 seconds timeout
});

socket.on("connect", () => {
  console.log(`[SOCKET LOG]: Connected to server with ID: ${socket.id}`);
});

socket.on("disconnect", (reason) => {
  console.log(`[SOCKET LOG]: Disconnected from server. Reason: ${reason}`);
});

socket.on("connect_error", (error) => {
  console.error(`[SOCKET ERROR]: Connection error`, error);
  console.error(`[SOCKET ERROR DETAILS]:`, error.message);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`[SOCKET LOG]: Reconnection attempt #${attempt}`);
});

socket.on("reconnect_failed", () => {
  console.error(`[SOCKET ERROR]: Reconnection failed after maximum attempts`);
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