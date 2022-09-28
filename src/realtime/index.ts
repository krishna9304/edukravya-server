import colors from "ansi-colors";
import { Server, Socket } from "socket.io";
import { server } from "..";
import userModel from "../database/models/user.model";
import { SocketActions } from "./actions";

// init socket server
const io = new Server(server);

let onlineUsers = new Map();

io.on(SocketActions.connection, (socket: Socket) => {
  showAllOnlineUsers();

  // populating online users
  socket.on(SocketActions.ADD_USER, async (userId) => {
    try {
      const userExists = await userModel.exists({ userId });
      if (userExists) onlineUsers.set(socket.id, userId);
    } catch (error) {
      socket.emit(SocketActions.ERROR, error);
    }
    showAllOnlineUsers();
  });

  // check if the user is online
  socket.on(SocketActions.IS_USER_ONLINE, (userId: String) => {
    const users: Array<String> = [...onlineUsers.values()];
    socket.emit("ONLINE_STATUS", users.includes(userId));
  });

  // send message to a specific user
  socket.on(SocketActions.SEND_MSG, ({ content, to }) => {
    const users: Array<String> = [...onlineUsers.values()];
    if (users.includes(to)) {
      const onlineUsersReverseKeyVal = new Map();

      onlineUsers.forEach((value, key) => {
        onlineUsersReverseKeyVal.set(value, key);
      });
      const receiverSocket = onlineUsersReverseKeyVal.get(to);
      socket.to(receiverSocket).emit(SocketActions.RECEIVE_MSG, {
        content,
        from: onlineUsers.get(socket.id),
      });
    }
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
