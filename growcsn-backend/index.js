/** @format */

const path = require("path");
const express = require("express");
const http = require("http");
const hpp = require("hpp");
const cors = require("cors");
const socket = require("socket.io");

// Load application config
require("dotenv").config({ path: "./config/config.env" });

// Init express app & create http server
const app = express();
const server = http.createServer(app);

// Create socket server
const io = socket(server, {
  transports: ["websocket"],
  cors: {
    origin: process.env.SERVER_FRONTEND_URL,
    credentials: true,
  },
});

// Load database
require("./database")();

// Init page settings
require("./utils/setting").settingInitDatabase();

// Enable if you are behind a reverse proxy
app.set("trust proxy", 1);

// Set other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());
app.use(
  cors({
    origin: [
      ...process.env.SERVER_FRONTEND_URL.split(","),
      "http://79.137.196.243",
    ],
    credentials: true,
  })
);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Mount routes
app.use("/", require("./routes")(io));
app.use("/public", express.static(path.join(__dirname, "public")));

// Mount sockets
require("./sockets")(io);

// Set app port
const PORT = process.env.SERVER_PORT || 5001;

server.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
