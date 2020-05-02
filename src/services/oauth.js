import { APIService } from "./api";
import socket from "../socket";

const login = (email, password) => {
  if (!email) throw new Error("Email is required for login");
  if (!password) throw new Error("Password is required for login");

  return APIService.post("/oauth/login", {
    email,
    password
  });
};

const getMyProfile = () => {
  return APIService.get("/oauth/me");
};

const logout = () => {
  return APIService.post("/oauth/logout").then(res => {
    socket.disconnect();
    return res;
  });
};

export const OAuthService = {
  login,
  logout,
  getMyProfile
};
