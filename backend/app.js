const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.route.js");
const messagesRoute = require("./routes/message.route.js");
const morgan = require("morgan");

const app = express();
// app.use(morgan({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/messages", messagesRoute);

app.get("/", (req, res) => {
  res.send("API is running ");
});

module.exports = app;
