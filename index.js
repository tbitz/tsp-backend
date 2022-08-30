require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const mailRoutes = require("./routes/mail");
const authRoutes = require("./routes/auth");
const pdfRoutes = require("./routes/pdf");
const projectRoutes = require("./routes/projects");
const customerRoutes = require("./routes/customers");
const activitiesRoutes = require("./routes/activities");
const processRoutes = require("./routes/processes");
const boardRoutes = require("./routes/boards");
const columnRoutes = require("./routes/columns");
const labelRoutes = require("./routes/labels");
const stepRoutes = require("./routes/steps");
const taskRoutes = require("./routes/tasks");
const searchRoutes = require("./routes/search");
const welcomeRoutes = require("./routes/welcome");
const messageRoutes = require("./routes/message");
const app = express();
const socket = require("socket.io");

connection();
app.use(cors());
app.use(express.json());

app.use("/api/mail/", mailRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/login/", authRoutes);
app.use("/api/projects/", projectRoutes);
app.use("/api/messages/", messageRoutes);
app.use("/api/pdf/", pdfRoutes);
app.use("/api/customers/", customerRoutes);
app.use("/api/activities/", activitiesRoutes);
app.use("/api/processes/", processRoutes);
app.use("/api/boards/", boardRoutes);
app.use("/api/columns/", columnRoutes);
app.use("/api/labels/", labelRoutes);
app.use("/api/steps/", stepRoutes);
app.use("/api/tasks/", taskRoutes);
app.use("/api/", searchRoutes);
app.use("/", welcomeRoutes);

const port = process.env.PORT || 6000;
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}...`)
);

const io = socket(server, {
  cors: {
    origin: process.env.FRONTEND,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    // when we log in we sign in the user as online
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.receiverId);
    if (sendUserSocket) {
      // we send the whole data, not just the text
      socket.to(sendUserSocket).emit("receive-msg", data);
    }
  });
});
