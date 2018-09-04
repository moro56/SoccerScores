const mongoose = require("mongoose");
const hat = require("hat");
const requireLogin = require("./../middlewares/requireLogin");

const User = mongoose.model("users");

module.exports = (app, io) => {
  app.get("/contact", requireLogin, async (req, res) => {
    const { lastTimestamp } = req.query;
    const accessToken = req.get("Access-Token");

    const user = await User.findOne({ accessToken });
    if (!user) {
      res
        .status(403)
        .send({ error: "Utente non trovato, si prega di riloggare!" });
    } else {
      if (
        !lastTimestamp ||
        (await User.findOne({
          updatedAt: {
            $gte: lastTimestamp || 0
          },
          accessToken
        }))
      ) {
        const friends = await User.find({
          _id: { $in: user.friends }
        });
        const invites = await User.find({
          _id: { $in: user.invites }
        });
        const invited = await User.find({
          _id: { $in: user.invited }
        });
        res.send({ friends, invites, invited });
      } else {
        res.send({ friends: [], invites: [], invited: [] });
      }
    }
  });

  app.post("/contact/acceptInvite", requireLogin, async (req, res) => {
    const { userId } = req.body;
    const accessToken = req.get("Access-Token");

    const user = await User.findOne({ accessToken });
    if (!user) {
      res
        .status(403)
        .send({ error: "Utente non trovato, si prega di riloggare!" });
    } else {
      const friend = await User.findOne({ _id: userId });
      if (!friend) {
        res.status(403).send({ error: "Utente non presente!" });
      } else {
        const index = user.invited.indexOf(userId);
        if (index > -1) {
          user.invited.splice(index, 1);
          user.friends.push(userId);
          await user.save();
        }
        const index2 = friend.invites.indexOf(user.id);
        if (index2 > -1) {
          friend.invites.splice(index2, 1);
          friend.friends.push(user.id);
          await friend.save();
        }
        io.acceptInvite(friend.accessToken, user.id);
        res.send({ user });
      }
    }
  });

  app.post("/contact/rejectInvite", requireLogin, async (req, res) => {
    const { userId } = req.body;
    const accessToken = req.get("Access-Token");

    const user = await User.findOne({ accessToken });
    if (!user) {
      res
        .status(403)
        .send({ error: "Utente non trovato, si prega di riloggare!" });
    } else {
      const friend = await User.findOne({ _id: userId });
      if (!friend) {
        res.status(403).send({ error: "Utente non presente!" });
      } else {
        const index = user.invited.indexOf(userId);
        if (index > -1) {
          user.invited.splice(index, 1);
          await user.save();
        }
        const index2 = friend.invites.indexOf(user.id);
        if (index2 > -1) {
          friend.invites.splice(index2, 1);
          await friend.save();
        }
        io.rejectInvite(friend.accessToken, user.id);
        res.send({ user });
      }
    }
  });

  app.post("/contact/add", requireLogin, async (req, res) => {
    const { email } = req.body;

    if (!email) {
      res.status(403).send({ error: "Specificare una email!" });
    } else {
      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        res.status(403).send({ error: "Utente non presente!" });
      } else {
        const accessToken = req.get("Access-Token");
        const { id, avatar, nickname, email } = dbUser;

        const user = await User.findOne({ accessToken });
        if (user.invites.indexOf(dbUser.id) > -1) {
          res.status(403).send({ error: "Utente già invitato!" });
        } else {
          user.invites.push(dbUser.id);
          dbUser.invited.push(user.id);
          await user.save();
          await dbUser.save();
          io.sendInvite(dbUser.accessToken, user);
          res.send({ user: { _id: id, avatar, nickname, email } });
        }
      }
    }
  });
};
