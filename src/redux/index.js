import { createStore, combineReducers, applyMiddleware } from "redux";
import { reducers, inititalState } from "./reducers";
import { initialMessageState } from "./reducers/message";
import thunk from "redux-thunk";

const storedUnreadMessages =
  JSON.parse(localStorage.getItem("unread-messages")) || [];

const presetMessageState = {
  ...initialMessageState,
  unreadMessages: storedUnreadMessages,
};

const combinedReducer = combineReducers(reducers);

const presetState = {
  ...inititalState,
  messages: presetMessageState,
};

const store = createStore(combinedReducer, presetState, applyMiddleware(thunk));

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem(
    "unread-messages",
    JSON.stringify(state.messages.unreadMessages)
  );
});

export default store;
