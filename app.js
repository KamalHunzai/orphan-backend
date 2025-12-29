require("dotenv").config();
const express = require("express");
const http = require("http");
const Sequelize = require("sequelize");
const config = require("./config/config.json");
const app = express();
const PORT = process.env.PORT;
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const adminRoutes = require("./src/routes/adminRoutes");
const childRoutes = require("./src/routes/childRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const visitReportRoutes = require("./src/routes/visitReportRoutes");
const visitPlanningtRoutes = require("./src/routes/visitPlanningRoutes");
const announcementRoutes = require("./src/routes/announcementRoutes");
const ActivityRoutes = require("./src/routes/ActivityRoutes");
const journalRoutes = require("./src/routes/journalRoutes");
const learningMaterialRoutes = require("./src/routes/learningMaterialsRoutes");
const superAdminRoutes = require("./src/routes/superAdminRoutes");
const reportsRoutes = require("./src/routes/reportsRoutes");
const managementRoutes = require("./src/routes/managementRoutes");
const commentRoutes = require("./src/routes/commentRoutes");

app.use("/admin", adminRoutes);
app.use("/child", childRoutes);
app.use("/tasks", taskRoutes);
app.use("/visitReports", visitReportRoutes);
app.use("/visitPlannings", visitPlanningtRoutes);
app.use("/announcements", announcementRoutes);
app.use("/activity", ActivityRoutes);
app.use("/journal", journalRoutes);
app.use("/learningmaterials", learningMaterialRoutes);
app.use("/superadmin", superAdminRoutes);
app.use("/reports", reportsRoutes);
app.use("/management", managementRoutes);
app.use("/comment", commentRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static(path.join(__dirname, "public")));
// 🚫 Disable caching globally
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});
const server = http.createServer(app);
let sequelize = new Sequelize(config.development);
const connect = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.error("Cannot connect to the database:", err.message);
    });
};
connect();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
// Start the server

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
