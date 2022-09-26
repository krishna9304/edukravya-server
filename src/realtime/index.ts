import { Server } from "socket.io";
import { server } from "..";

// init socket server
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
