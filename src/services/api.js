import axios from "axios";
import store from "../redux";
import { setUser } from "../redux/actions/auth";
import qs from "querystring";
import { addAlert } from "../redux/actions";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 60000,
  withCredentials: true
});

const defaultGet = http.get;

http.get = (url, query, config) => {
  if (query) {
    const querystring = qs.stringify(query);
    url += `?${querystring}`;
  }

  return defaultGet(url, config);
};

http.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    console.error(err);
    if (err.response) {
      if (err.response.status === 401) {
        store.dispatch(setUser(null));
        window.location.assign("#/login");
      }
      if (err.response.data && err.response.data.error_message) {
        store.dispatch(
          addAlert({
            message: err.response.data.error_message,
            type: "danger"
          })
        );
      }
    } else if (err.message) {
      store.dispatch(
        addAlert({
          message: err.message,
          type: "danger"
        })
      );
    }
    throw err;
  }
);

export const APIService = http;
