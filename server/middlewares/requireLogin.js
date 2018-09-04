const mongoose = require("mongoose");

const User = mongoose.model("users");

module.exports = async (req, res, next) => {
  if (!req.get("Access-Token")) {
    return res.status(401).send({ error: "You must log in!" });
  } else {
    const user = await User.findOne({ accessToken: req.get("Access-Token") });
    if (!user) {
      return res.status(401).send({ error: "You must log in!" });
    }
  }

  next();
};
