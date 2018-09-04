import {types} from "mobx-state-tree";

export default types.model("Error", {
  error: types.optional(types.string, "")
}).actions(self => {
  function notifyError(error) {
    self.error = error;
  }

  function errorShown() {
    self.error = "";
  }

  return {
    notifyError,
    errorShown
  }
}).create({});