const routes = require("express").Router();
const taskModel = require("../model/tasksModel");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { generateData, saveData } = require("./impFunc");
const mongoose = require("mongoose");
const runDailyReminder = require('../utilities/cron');

routes.get("/", (req, res) => {
  res.render("login");
});

routes.get("/home", (req, res) => {
  res.render("home");
});

routes.get("/dashboard", (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.redirect("/");
    }
    const userTasks = await taskModel.find({
      userId: new mongoose.Types.ObjectId(decoded.id),
    });
    res.render("dashboard", { dailyTasks: userTasks, name: "hello" });
  });
});

routes.post("/login", async (req, res) => {
  const requesteduser = req.body;
  const userExists = await userModel.findOne({ email: requesteduser.email });
  if (userExists) {
    const token = jwt.sign(
      { email: userExists.email, id: userExists._id },
      process.env.JWT_SECRET_KEY,
    );
    res.cookie("token", token);
    return res.redirect("/home");
  } else {
    const user = await userModel.create({
      username: requesteduser.name,
      email: requesteduser.email,
    });
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token);
    res.redirect("/home");
  }
});

routes.post("/userData", async (req, res) => {
  const token = req.cookies.token;

  let date1 = new Date(req.body["deadline-date"]);
  let date2 = new Date();
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userData = {
    subjectName: req.body["subject-name"],
    deadline: req.body["deadline-description"],
    goal: req.body["exam-goal"],
    hoursPerDay: req.body["hours-per-day"],
    email: decoded.email,
    days: Math.floor(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24)),
  };
  res.redirect("/home"); // respond immediately

  await generateData(userData).catch((err) => {
    console.error("Background AI generation failed:", err.message);
  });
});

routes.get('/test', async (req, res) => {
  try {
    await runDailyReminder();
    res.json({ success: true, message: 'Reminder emails sent!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
module.exports = routes;
