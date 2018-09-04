const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { Schema } = mongoose;

const scoreSchema = new Schema({
  contactId1: String,
  teamId1: String,
  result1: Number,
  contactId2: String,
  teamId2: String,
  result2: Number
});
scoreSchema.plugin(timestamps);

mongoose.model("scores", scoreSchema);
