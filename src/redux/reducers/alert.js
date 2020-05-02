import { ADD_ALERT, REMOVE_ALERT } from "../actions";

export const initialAlertState = {
  alerts: [],
};

export const alertReducer = (state = initialAlertState, action) => {
  let alerts = state.alerts;
  switch (action.type) {
    case ADD_ALERT:
      alerts = state.alerts;
      alerts.push(action.options);
      return {
        ...state,
        alerts,
      };
    case REMOVE_ALERT:
      alerts = state.alerts.filter((alert) => alert.id !== action.id);
      return {
        ...state,
        alerts,
      };
    default:
      return state;
  }
};
