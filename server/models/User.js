const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  facebookId: String,
  avatar: String,
  nickname: String,
  email: String,
  accessToken: String,
  friends: [Schema.Types.ObjectId],
  invites: [Schema.Types.ObjectId],
  invited: [Schema.Types.ObjectId]
});
userSchema.plugin(timestamps);

mongoose.model("users", userSchema);
