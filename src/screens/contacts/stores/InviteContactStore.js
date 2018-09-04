import {types, flow} from "mobx-state-tree";

import api from "./../../../api";
import {Contact} from "./../../../realm";
import {errorStore} from "./../../../stores";

export default types.model({
  email: types.optional(types.string, ""),
}).actions(self => {
  function setEmail(email) {
    self.email = email;
  }

  const invite = flow(function*() {
    const {ok, data} = yield api.post("/contact/add", {email: self.email});
    if (ok) {
      Contact.createOrUpdate(data.user, "invites");
    } else {
      errorStore.notifyError(data.errorMessage);
      throw data;
    }
  });

  return {
    setEmail,
    invite
  }
}).create({result1: 0, result2: 0});