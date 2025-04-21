//socket.js
import { io } from "socket.io-client";
import axios from "axios";

// Dynamically determine the WebSocket server URL
const getWebSocketURL = () => {
  if (process.env.REACT_APP_BACKEND_URL) {
    return process.env.REACT_APP_BACKEND_URL.replace(/^http/, "ws");
  }
  if (window.location.hostname.includes("github.dev")) {
    // Ensure the WebSocket URL uses port 5000
    return `wss://${window.location.hostname.replace("-3000", "-5000")}`;
  }
  return "ws://localhost:5000"; // Default for local development
};

const serverUrl = getWebSocketURL();
console.log(`[SOCKET LOG]: Attempting to connect to WebSocket server at ${serverUrl}`);

const token = localStorage.getItem("token"); // or sessionStorage.getItem("token")

const socket = io(serverUrl, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  timeout: 20000,
  auth: {
    token: token, // Send token during connection
  },
});

const refreshToken = async (expiredToken) => {
  try {
    const response = await axios.post("http://localhost:5000/api/users/refresh-token", {
      token: expiredToken,
    });

    if (response.status === 200) {
      const newToken = response.data.token;
      localStorage.setItem("token", newToken); // Update token in localStorage
      console.log("[SOCKET LOG]: Token refreshed successfully.");
      return newToken;
    }
  } catch (error) {
    console.error("[SOCKET ERROR]: Failed to refresh token:", error.message);
    return null;
  }
};

socket.on("connect", () => {
  console.log(`[SOCKET LOG]: Connected to server with ID: ${socket.id}`);
});

socket.on("disconnect", (reason) => {
  console.log(`[SOCKET LOG]: Disconnected from server. Reason: ${reason}`);
});

socket.on("connect_error", async (error) => {
  console.error(`[SOCKET ERROR]: Connection error`, error);

  if (error.message === "jwt expired") {
    console.log("[SOCKET LOG]: Attempting to refresh token...");
    const expiredToken = localStorage.getItem("token");
    const newToken = await refreshToken(expiredToken);

    if (newToken) {
      socket.auth.token = newToken; // Update token in socket auth
      socket.connect(); // Reconnect with the new token
    } else {
      console.error("[SOCKET ERROR]: Unable to refresh token. Please log in again.");
    }
  }
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

socket.on("message", (data) => {
  console.log("Received message:", data);

});

// Wrap emit to log outgoing messages
const originalEmit = socket.emit;
socket.emit = function (event, ...args) {
  console.log(`[SOCKET EMIT]: Event: ${event}`, args);
  originalEmit.apply(socket, [event, ...args]);
};

export default socket;