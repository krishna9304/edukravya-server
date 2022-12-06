import colors from "ansi-colors";
import { Server, Socket } from "socket.io";
import { server } from "..";
import userModel from "../database/models/user.model";
import { CLIENT_URL } from "../constants";
import {
  ADD_USER,
  connection,
  disconnect,
  ERROR,
  GET_ONLINE_USERS,
  GET_STREAM,
  GET_USER,
  GET_USER_REQUEST,
  IS_ADMIN,
  IS_USER_ONLINE,
  JOIN_LECTURE,
  PAUSE_USER,
  RECEIVE_MSG,
  SEND_MSG,
} from "./actions";
import chatModel from "../database/models/chat.model";

// init socket server
const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL],
  },
});

let onlineUsers: Map<string, string> = new Map();

// TODO: implement socketio-jwt

io.on(connection, (socket: Socket) => {
  // showAllOnlineUsers();
  socket.emit(connection);

  // populating online users
  socket.on(ADD_USER, async (userId) => {
    try {
      const userExists = await userModel.exists({ userId });
      if (userExists) {
        onlineUsers.set(socket.id, userId);
        const userIds = [...onlineUsers.values()];
        const users = await userModel.find({ userId: { $in: userIds } });
        socket.broadcast.emit("ONLINE_USERS", users);
      }
    } catch (error) {
      socket.emit(ERROR, error);
    }
    showAllOnlineUsers();
  });

  // check if the user is online
  socket.on(IS_USER_ONLINE, (userId: String) => {
    const users: Array<String> = [...onlineUsers.values()];
    socket.emit("ONLINE_STATUS", users.includes(userId));
  });

  // send message to a specific user
  socket.on(SEND_MSG, async ({ to, chatDoc }) => {
    const users: Array<String> = [...onlineUsers.values()];

    if (users.includes(to)) {
      try {
        const onlineUsersReverseKeyVal = new Map();

        onlineUsers.forEach((value, key) => {
          onlineUsersReverseKeyVal.set(value, key);
        });
        const receiverSocket = onlineUsersReverseKeyVal.get(to);
        socket.broadcast.to(receiverSocket).emit(RECEIVE_MSG, chatDoc);
      } catch (error) {
        socket.emit(ERROR, error);
      }
    }
  });

  // returns all the online users
  socket.on(GET_ONLINE_USERS, async (userId) => {
    try {
      const userExists = await userModel.exists({ userId });
      if (userExists) {
        const userIds = [...onlineUsers.values()];
        const users = await userModel.find({ userId: { $in: userIds } });
        socket.emit("ONLINE_USERS", users);
      }
    } catch (error) {
      socket.emit(ERROR, error);
    }
  });

  socket.addListener(disconnect, async () => {
    console.log("Client disconnected: " + colors.red(socket.id));
    onlineUsers.delete(socket.id);
    showAllOnlineUsers();
    const userIds = [...onlineUsers.values()];
    const users = await userModel.find({ userId: { $in: userIds } });
    socket.broadcast.emit("ONLINE_USERS", users);
  });

  // webRTC
  socket.on(
    JOIN_LECTURE,
    ({ lectureId, peerId }: { lectureId: string; peerId: string }): void => {
      // verify user identity

      socket.join(lectureId);
      console.log(colors.blueBright(`[${socket.id}] joined ${lectureId}`));

      // check if the connected user is admin;
      // temporarily setting the first user as admin; pink;
      const clientsInRoom: Set<string> | undefined =
        io.sockets.adapter.rooms.get(lectureId);
      const viewerCount: number = (clientsInRoom ? clientsInRoom.size : 0) - 1;

      const isAdmin: boolean = !viewerCount;

      if (isAdmin) {
        socket.on(GET_USER, () => {
          socket.to(lectureId).emit(GET_USER);
        });
        socket.on(PAUSE_USER, () => {
          socket.to(lectureId).emit(PAUSE_USER);
        });
        socket.on(GET_USER_REQUEST, () => {
          socket.to(lectureId).emit(GET_USER);
        });
      } else {
        io.to(lectureId).emit(GET_STREAM, peerId);
      }
      socket.emit(IS_ADMIN, isAdmin);
    }
  );
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
