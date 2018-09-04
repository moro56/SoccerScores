import {create} from "apisauce";
import {autorun} from 'mobx';

import {accountStore} from "./../stores";
import * as config from "./../utils/config";

const api = create({
  baseURL: config.IS_DEV ? "http://192.168.91.129:3000" : "https://fifa-scores-nj.herokuapp.com",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

setImmediate(() => {
  autorun(() => {
    api.setHeader('Access-Token', accountStore.apiToken);
  });
});

api.addResponseTransform(response => {
  if (!response.data) {
    response.data = {};
  }
  const {ok, problem, data} = response;
  if (!ok) {
    switch (problem) {
      case 'CLIENT_ERROR':
        if (!data.errorMessage) {
          data.errorMessage = "An error has occurred. Please try again.";
        }
        if (data.status === 401) {
          // stores.authStore.accessTokenExpired();
        }
        break;
      case 'SERVER_ERROR':
        data.errorMessage = "There was an error with the server.";
        break;
      case 'TIMEOUT_ERROR':
        data.errorMessage = "The server did not respond in time. Please try again later.";
        break;
      case 'CONNECTION_ERROR':
        data.errorMessage = "Server not available. Please try again later.";
        break;
      case 'NETWORK_ERROR':
        data.errorMessage = "Connection not available.";
        break;
      case 'CANCEL_ERROR':
        break;
      default:
        break;
    }
  }
});

export default api;
