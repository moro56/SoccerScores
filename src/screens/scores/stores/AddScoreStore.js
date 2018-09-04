import {types, flow} from "mobx-state-tree";
import {Team} from "./../../../realm";

import api from "./../../../api";
import {Score} from "./../../../realm";
import {errorStore} from "./../../../stores";

export default types.model({
  player1: types.frozen,
  team1: types.frozen,
  player2: types.frozen,
  team2: types.frozen,
  result1: types.number,
  result2: types.number
}).views(self => ({
  get player1Id() {
    if (self.player1) {
      return self.player1.id
    }
    return null;
  },

  get player1Icon() {
    if (self.player1) {
      return self.player1.avatar
    }
    return null;
  },

  get player1Name() {
    if (self.player1) {
      return self.player1.name
    }
    return "Player";
  },

  get team1Id() {
    if (self.team1) {
      return self.team1.id
    }
    return null;
  },

  get team1Icon() {
    if (self.team1) {
      return self.team1.crest
    }
    return null;
  },

  get team1Name() {
    if (self.team1) {
      return self.team1.name
    }
    return "Team";
  },

  get player2Id() {
    if (self.player2) {
      return self.player2.id
    }
    return null;
  },

  get player2Icon() {
    if (self.player2) {
      return self.player2.avatar
    }
    return null;
  },

  get player2Name() {
    if (self.player2) {
      return self.player2.name
    }
    return "Player";
  },

  get team2Id() {
    if (self.team2) {
      return self.team2.id
    }
    return null;
  },

  get team2Icon() {
    if (self.team2) {
      return self.team2.crest
    }
    return null;
  },

  get team2Name() {
    if (self.team2) {
      return self.team2.name
    }
    return "Team";
  }
})).actions(self => {
  function decResult1() {
    if (self.result1 !== 0) {
      self.result1 -= 1;
    }
  }

  function incResult1() {
    if (self.result1 < 99) {
      self.result1 += 1;
    }
  }

  function decResult2() {
    if (self.result2 !== 0) {
      self.result2 -= 1;
    }
  }

  function incResult2() {
    if (self.result2 < 99) {
      self.result2 += 1;
    }
  }

  function onContactChoosen(contact, isContact1) {
    if (isContact1) {
      self.player1 = contact;
    } else {
      self.player2 = contact;
    }
  }

  function onTeamChoosen(team, isTeam1) {
    if (isTeam1) {
      self.team1 = team;
    } else {
      self.team2 = team;
    }
  }

  const addScore = flow(function* () {
    const {ok, data} = yield api.post("/score/add", {
      contactId1: self.player1Id,
      teamId1: self.team1Id,
      result1: self.result1,
      contactId2: self.player2Id,
      teamId2: self.team2Id,
      result2: self.result2
    });
    if (ok) {
      Score.create(data.score);
    } else {
      errorStore.notifyError(data.errorMessage);
    }

    return {ok, data};
  });

  return {
    decResult1,
    incResult1,
    decResult2,
    incResult2,
    onContactChoosen,
    onTeamChoosen,
    addScore
  }
}).create({result1: 0, result2: 0});
