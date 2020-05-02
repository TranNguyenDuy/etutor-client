import { authReducer, initialAuthState } from "./auth";
import { messageReducer, initialMessageState } from "./message";
import { alertReducer, initialAlertState } from "./alert";
import { notificationReducer, initialNotiState } from "./notifications";
import { meetingReduce, initialMeetingState } from "./meeting";

export const reducers = {
  auth: authReducer,
  alert: alertReducer,
  messages: messageReducer,
  notifications: notificationReducer,
  meeting: meetingReduce,
};

export const inititalState = {
  auth: initialAuthState,
  alert: initialAlertState,
  messages: initialMessageState,
  notifications: initialNotiState,
  meeting: initialMeetingState,
};
