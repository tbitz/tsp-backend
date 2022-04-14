require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const projectRoutes = require("./routes/projects");
const stepRoutes = require("./routes/steps");
const searchRoutes = require("./routes/search");
const app = express();

connection();
app.use(cors());
app.use(express.json());

app.use("/api/users/", userRoutes);
app.use("/api/login/", authRoutes);
app.use("/api/tasks/", taskRoutes);
app.use("/api/projects/", projectRoutes);
app.use("/api/steps/", stepRoutes);
app.use("/api/", searchRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
