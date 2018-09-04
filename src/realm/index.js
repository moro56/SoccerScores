import Realm from "realm";

import Team from "./Team";
import Contact from "./Contact";
import Score from "./Score";
import Config from "./Config";

export default new Realm({
  schema: [
    Team,
    Contact,
    Score,
    Config
  ],
  schemaVersion: 6
});

export {
  Team,
  Contact,
  Score,
  Config
};