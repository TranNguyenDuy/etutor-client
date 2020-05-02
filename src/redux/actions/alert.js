import { v4 as uuid } from "uuid";
import store from "..";

export const ADD_ALERT = "ALERT/ADD";
export const REMOVE_ALERT = "ALERT/REMOVE";

export const removeAlert = id => ({
  type: REMOVE_ALERT,
  id
});

export const addAlert = options => {
  options.id = uuid();
  setTimeout(() => {
    store.dispatch(removeAlert(options.id));
  }, 5000);
  return {
    type: ADD_ALERT,
    options
  };
};
