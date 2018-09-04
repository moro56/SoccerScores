import {types, flow} from "mobx-state-tree";

import api from "./../api";
import {Contact} from "./../realm";
import {errorStore} from "./";

export default types.model("ContactStore", {}).actions(self => {
  const acceptInvite = flow(function*(userId) {
    try {
      const {ok, data} = yield api.post("/contact/acceptInvite", {userId});
      if (ok) {
        Contact.acceptInvite(userId);
      } else {
        errorStore.notifyError(data.errorMessage);
      }
    } catch (e) {
      errorStore.notifyError(e);
    }
  });

  const rejectInvite = flow(function*(userId) {
    try {
      const {ok, data} = yield api.post("/contact/rejectInvite", {userId});
      if (ok) {
        Contact.rejectInvite(userId);
      } else {
        errorStore.notifyError(data.errorMessage);
      }
    } catch (e) {
      errorStore.notifyError(e);
    }
  });

  return {
    acceptInvite,
    rejectInvite
  }
}).create({});