const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
require("./models/User");
require("./models/Score");

mongoose.connect(keys.mongoDb);

const app = express();
app.use(express.json());

var server = require("http").createServer(app);
const io = require("socket.io")(server);
require("./services/socket")(io);

require("./routes/authRoutes")(app, io);
require("./routes/contactRoutes")(app, io);
require("./routes/scoreRoutes")(app, io);

const PORT = process.env.PORT || 3000;
server.listen(PORT);
