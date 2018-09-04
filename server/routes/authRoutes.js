const mongoose = require("mongoose");
const hat = require("hat");

const User = mongoose.model("users");

module.exports = (app, io) => {
  app.post("/login/google", async (req, res) => {
    const { user } = req.body;

    if (!user) {
      res.status(403).send({ error: "Errore di autenticazione!" });
    } else {
      const { uid, email, displayName, photoURL } = user;
      if (!email || !displayName) {
        res.status(403).send({ error: "Errore di autenticazione!" });
        return;
      }

      let dbUser = await User.findOne({ email });
      if (!dbUser) {
        dbUser = await new User({
          googleId: uid,
          avatar: photoURL,
          nickname: displayName,
          email,
          accessToken: hat(),
          friends: [],
          invites: [],
          invited: []
        }).save();
      } else {
        dbUser.set({ googleId: uid });
        dbUser = await dbUser.save();
      }
      res.send({ user: dbUser });
    }
  });

  app.post("/login/facebook", async (req, res) => {
    const { user, accessToken } = req.body;

    if (!user || !accessToken) {
      res.status(403).send({ error: "Errore di autenticazione!" });
    } else {
      const { id, email, name, last_name } = user;
      if (!email || !name) {
        res.status(403).send({ error: "Errore di autenticazione!" });
        return;
      }

      let dbUser = await User.findOne({ email });
      if (!dbUser) {
        dbUser = await new User({
          facebookId: id,
          nickname: name + (last_name ? " " + last_name : ""),
          email,
          accessToken: hat(),
          friends: [],
          invites: [],
          invited: []
        }).save();
      } else {
        dbUser.set({ facebookId: id });
        dbUser = await dbUser.save();
      }
      res.send({ user: dbUser });
    }
  });
};
