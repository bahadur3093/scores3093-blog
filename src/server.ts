import http from "http";
import { Server } from "socket.io";
import app from "./app"; // Import the Express app
import { improveTest2Socket } from "./controller/ai.controller";

const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// // Initialize WebSocket handling
// improveTest2Socket(io);

const PORT = process.env.PORT || 5000;

// Start the HTTP server (includes both APIs and WebSocket support)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
