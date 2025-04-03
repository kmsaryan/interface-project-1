//socket.js
//src/utils/socket.js
// This file handles the socket connection and events for the client-side application.
// It connects to the server, listens for events, and emits events as needed.
// It also includes error handling and logging for better debugging.
import { io } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"; // Use environment variable or default to localhost:5000

const socket = io(SERVER_URL, {
  transports: ["websocket"], // Ensure WebSocket is used for better reliability
  timeout: 20000, // Increase timeout to handle slower connections
});

socket.on("connect", () => {
  console.log(`[SOCKET LOG]: Connected to server with ID: ${socket.id}`);
});

socket.on("disconnect", (reason) => {
  console.log(`[SOCKET LOG]: Disconnected from server. Reason: ${reason}`);
});

socket.on("connect_error", (error) => {
  console.error(`[SOCKET ERROR]: Connection error`, error);
  console.error(
    `Possible causes:
    1. The server is not running.
    2. The server is running on a different port or URL.
    3. Network issues are preventing the connection.
    Suggested actions:
    - Verify the server is running and accessible at ${SERVER_URL}.
    - Check your .env configuration for REACT_APP_SERVER_URL.
    - Ensure no firewall or network restrictions are blocking the connection.`
  );
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