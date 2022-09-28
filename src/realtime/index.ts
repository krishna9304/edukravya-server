import colors from "ansi-colors";
import { Server, Socket } from "socket.io";
import { server } from "..";
import { CLIENT_URL } from "../constants";
import { SocketActions } from "./actions";

// init socket server
const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL],
  },
});

let onlineUsers = new Map();

io.on(SocketActions.connection, (socket: Socket) => {
  showAllOnlineUsers();

  // populating online users
  socket.on(SocketActions.ADD_USER, (userId) => {
    onlineUsers.set(socket.id, userId);
    showAllOnlineUsers();
  });

  socket.on(SocketActions.IS_USER_ONLINE, (userId: String) => {
    let users: Array<String> = [...onlineUsers.values()];
    socket.emit("ONLINE_STATUS", users.includes(userId));
  });

  socket.on(SocketActions.disconnect, () => {
    console.log("Client disconnected: " + colors.red(socket.id));
    onlineUsers.delete(socket.id);
  });
});

// show all online users
const showAllOnlineUsers = () => {
  let users: Array<String> = [];
  onlineUsers.forEach((value) => {
    users.push(value);
  });
  if (users.length > 0) {
    console.log(colors.bold(colors.whiteBright("\n  Clients connected")));
  } else {
    console.log(colors.bold(colors.whiteBright("\n No  Clients connected")));
  }

  console.log(
    colors.cyanBright(colors.bold(`\n  Total connections: ${users.length} `))
  );
};
