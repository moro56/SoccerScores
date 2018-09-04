import {types, flow} from "mobx-state-tree";
import moment from 'moment';

import api from "./../api";
import {Contact, Score, Config} from "./../realm";
import {errorStore} from "./";

function getLastTimestamp() {
  return Config.get("lastTimestamp") || 0;
}

function updateLastTimestamp() {
  Config.put("lastTimestamp", "" + moment.utc(moment.now().valueOf()).unix() * 1000);
}

export default types.model("SocketStore", {}).actions(self => {
  const sync = flow(function*() {
    if (!Contact.myself()) {
      return;
    }

    const lastTimestamp = getLastTimestamp();
    let formattedLastTimestamp = undefined;
    if (lastTimestamp) {
      formattedLastTimestamp = moment.utc(parseInt(lastTimestamp)).format("YYYY-MM-DDTHH:mm:ss.SSS").toString() + "Z";
    }

    const {ok:okFriends, data:dataFriends} = yield api.get("/contact", {lastTimestamp: formattedLastTimestamp});
    if (okFriends) {
      const friends = dataFriends.friends;
      const invites = dataFriends.invites;
      const invited = dataFriends.invited;
      Contact.sync(friends, invites, invited);
    } else {
      errorStore.notifyError(dataFriends.errorMessage);
      throw dataFriends;
    }

    const {ok:okScore, data:dataScore} = yield api.get("/score", {lastTimestamp: formattedLastTimestamp});
    if (okScore) {
      const scores = dataScore.scores;
      Score.sync(scores);
    } else {
      errorStore.notifyError(dataScore.errorMessage);
      throw dataScore;
    }

    updateLastTimestamp();
  });

  function onSendScore(score) {
    try {
      Score.create(score);
    } catch (e) {
      errorStore.notifyError(e);
    }
  }

  function onAcceptInvite(userId) {
    try {
      Contact.acceptInvite(userId);
    } catch (e) {
      errorStore.notifyError(e);
    }
  }

  function onRejectInvite(userId) {
    try {
      Contact.rejectInvite(userId);
    } catch (e) {
      errorStore.notifyError(e);
    }
  }

  function onSendInvite(user) {
    try {
      user.notDeleted = true;
      Contact.createOrUpdate(user, "invited");
    } catch (e) {
      errorStore.notifyError(e);
    }
  }

  return {
    sync,
    onSendScore,
    onAcceptInvite,
    onRejectInvite,
    onSendInvite
  }
}).create({});