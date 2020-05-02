import { PUSH_NOTI } from "../actions";

export const initialNotiState = {
  notifications: [],
};

export function notificationReducer(state = initialNotiState, action) {
  let notifications = state.notifications;
  switch (action.type) {
    case PUSH_NOTI:
      if (action.noti) notifications.push(action.noti);
      return {
        ...state,
        notifications,
      };
    default:
      return state;
  }
}
