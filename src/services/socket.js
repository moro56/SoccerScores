import io from "socket.io-client";

import {accountStore, socketStore} from "./../stores";
import * as config from "./../utils/config";

let socket = undefined;

function connect() {
  const url = config.IS_DEV ? "http://192.168.91.129:3000?token=" : "https://fifa-scores-nj.herokuapp.com?token=";
  socket = io(url + accountStore.apiToken);

  socket.on("error", error=> {
    console.log(error)
  });
  socket.on("connect", error=> {
    console.log(error)
  });
  socket.on("connect_error", error=> {
    console.log(error)
  });
  socket.on("connect_timeout", error=> {
    console.log(error)
  });
  socket.on("sendScore", score => {
    socketStore.onSendScore(score);
  });

  socket.on("acceptInvite", ({userId}) => {
    socketStore.onAcceptInvite(userId);
  });

  socket.on("rejectInvite", ({userId}) => {
    socketStore.onRejectInvite(userId);
  });

  socket.on("sendInvite", ({user}) => {
    socketStore.onSendInvite(user);
  });
}

function disconnect() {
  if (socket) {
    socket.disconnect();
  }
}

export {
  connect,
  disconnect
};
