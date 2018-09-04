import {types} from "mobx-state-tree";

import {Config} from "./../realm";

export default types.model("AccountStore", {
  apiToken: types.maybe(types.string),
  userId: types.maybe(types.string)
}).actions(self => {
  function updateInfo(user, accessToken) {
    self.userId = user._id;
    Config.put("userId", user._id);
    self.apiToken = accessToken;
    Config.put("accessToken", accessToken);
  }

  function logout() {
    self.userId = null;
    Config.remove("userId");
    self.apiToken = null;
    Config.remove("accessToken");
  }

  return {
    updateInfo,
    logout
  }
}).create({apiToken: Config.get("accessToken"), userId: Config.get("userId")});
