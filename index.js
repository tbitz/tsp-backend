require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const mailRoutes = require("./routes/mail");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const customerRoutes = require("./routes/customers");
const categoryRoutes = require("./routes/categories");
const boardRoutes = require("./routes/boards");
const columnRoutes = require("./routes/columns");
const labelRoutes = require("./routes/labels");
const stepRoutes = require("./routes/steps");
const taskRoutes = require("./routes/tasks");
const searchRoutes = require("./routes/search");
const welcomeRoutes = require("./routes/welcome");
const app = express();

connection();
app.use(cors());
app.use(express.json());

app.use("/api/mail/", mailRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/login/", authRoutes);
app.use("/api/projects/", projectRoutes);
app.use("/api/customers/", customerRoutes);
app.use("/api/categories/", categoryRoutes);
app.use("/api/boards/", boardRoutes);
app.use("/api/columns/", columnRoutes);
app.use("/api/labels/", labelRoutes);
app.use("/api/steps/", stepRoutes);
app.use("/api/tasks/", taskRoutes);
app.use("/api/", searchRoutes);
app.use("/", welcomeRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
