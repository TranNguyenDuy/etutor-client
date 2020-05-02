import { SET_USER_ACTION } from "../actions/auth";

export const initialAuthState = {
  user: null,
};

export const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case SET_USER_ACTION:
      return {
        user: action.data || null,
      };
    default:
      return state;
  }
};
