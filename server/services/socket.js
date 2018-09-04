module.exports = io => {
  let allClient = [];

  function getUserSocket(accessToken) {
    return allClient.find(item => item.token === accessToken);
  }

  io.on("connection", client => {
    const { _query } = client.request;
    if (!_query || !_query.token) {
      return;
    }
    console.log("connesso", allClient.length);
    const oldClient = allClient.find(item => item.token === _query.token);
    if (oldClient) {
      oldClient.socket === client;
    } else {
      allClient.push({ socket: client, token: _query.token });

      client.on("disconnect", () => {
        console.log("disconnected");
        allClient = allClient.filter(item => item.socket !== client);
      });
    }
  });

  io.sendScore = (accessToken, score) => {
    const socket = getUserSocket(accessToken);
    if (!socket) return;

    io.emit("sendScore", { score });
  };

  io.sendInvite = (accessToken, user) => {
    const socket = getUserSocket(accessToken);
    if (!socket) return;

    io.emit("sendInvite", { user });
  };

  io.acceptInvite = (accessToken, userId) => {
    const socket = getUserSocket(accessToken);
    if (!socket) return;

    io.emit("acceptInvite", { userId });
  };

  io.rejectInvite = (accessToken, userId) => {
    const socket = getUserSocket(accessToken);
    if (!socket) return;

    io.emit("rejectInvite", { userId });
  };
};
