const mongoose = require("mongoose");
const requireLogin = require("./../middlewares/requireLogin");

const Score = mongoose.model("scores");
const User = mongoose.model("users");

module.exports = (app, io) => {
  app.get("/score", requireLogin, async (req, res) => {
    const { lastTimestamp } = req.query;
    const accessToken = req.get("Access-Token");

    const user = await User.findOne({ accessToken });
    if (!user) {
      res
        .status(403)
        .send({ error: "Utente non trovato, si prega di riloggare!" });
    } else {
      const scores = await Score.find({
        createdAt: {
          $gte: lastTimestamp || 0
        },
        $or: [
          {
            contactId1: user.id
          },
          {
            contactId2: user.id
          }
        ]
      });

      res.send({ scores });
    }
  });

  app.post("/score/add", requireLogin, async (req, res) => {
    const {
      contactId1,
      teamId1,
      result1,
      contactId2,
      teamId2,
      result2
    } = req.body;
    const accessToken = req.get("Access-Token");

    if (!contactId1 || !teamId1 || !contactId2 || !teamId2) {
      res.status(403).send({ error: "Specificare tutte le informazioni!" });
    } else {
      const user1 = await User.findOne({ _id: contactId1 });
      const user2 = await User.findOne({ _id: contactId2 });
      if (!user1) {
        res.status(403).send({ error: "Primo utente non trovato!" });
      } else if (!user2) {
        res.status(403).send({ error: "Secondo utente non trovato!" });
      } else {
        const newScore = await new Score({
          contactId1,
          teamId1,
          result1,
          contactId2,
          teamId2,
          result2
        }).save();
        if (accessToken === user1.accessToken) {
          io.sendScore(user2.accessToken, newScore);
        } else {
          io.sendScore(user1.accessToken, newScore);
        }
        res.send({ score: newScore });
      }
    }
  });
};
