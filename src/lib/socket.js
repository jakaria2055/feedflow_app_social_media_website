import { io } from "socket.io-client";

// const BACKEND_URL = "http://localhost:2729";
export const BACKEND_URL=  "https://feedflow-server-scoial-media-website.onrender.com"
let socket = null;

export const connectSocket = (userId) => {
  //if socket already exist and connected
  if (socket?.connected) {
    console.log("Socket already connected.");
    return socket;
  }

  //If Socket already exist but disconnected
  if (socket) {
    console.log("Cleaning up previous socket");
    socket.disconnect();
    socket.null;
  }

  //Create new socket connection
  socket = io(BACKEND_URL, {
    query: { userId },
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    console.log("Disconnected socket");
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = () => {
  return socket?.connected || false;
};
