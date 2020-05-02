import io from "socket.io-client";
let socket = io.connect(process.env.REACT_APP_API_BASE_URL, {
  reconnect: true,
});

export default socket;
