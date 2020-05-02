import socket from "../../socket";

export const SET_USER_ACTION = "AUTH/SET_USER";

export const setUser = (user) => {
  if (user) {
    if (!socket.connected) socket.connect();
    socket.emit("init", user.id);
  } else {
    if (!socket.disconnected) socket.disconnect();
  }
  return {
    type: SET_USER_ACTION,
    data: user,
  };
};
