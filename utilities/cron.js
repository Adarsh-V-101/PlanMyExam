// cron/dailyReminder.js
const cron = require("node-cron");
const User = require("../model/userModel");
const Task = require("../model/tasksModel");
const sendMail = require("../utilities/mailer");
const { dailyTaskTemplate } = require("../utilities/emailTemplate");
const userModel = require("../model/userModel");

// calculate day number relative to a subject's startDate
const getDayNumber = (startDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Day 1 = startDate itself
};

const startDailyReminder = async () => {
  cron.schedule('0 6 * * *', async () => {
  console.log("⏰ Running daily task reminder...");

  try {
    const users = await userModel.find({}).populate("taskId");

    console.log(users.length + " users found with tasks"); // for debugging

    for (const user of users) {
      const todaysTasks = [];

      for (const subjectDoc of user.taskId) {
        // each subject has its own startDate
        const dayNumber = getDayNumber(subjectDoc.startDate);

        const matchingTasks = subjectDoc.tasks.filter(
          (t) => t.dayNumber === dayNumber,
        );

        matchingTasks.forEach((t) => {
          todaysTasks.push({
            subject: subjectDoc.subject,
            title: t.title,
            duration: t.duration,
            dayNumber,
          });
        });
      }
      
      if (todaysTasks.length === 0) {
        console.log(`⚠️  No tasks today for ${user.email}`);
        continue;
      }
      await sendMail({
        to: user.email,
        subject: `📚 Your Study Tasks for Today — PlanMyExam`,
        html: dailyTaskTemplate(todaysTasks, user.username),
      });

      console.log(`✅ Email sent to ${user.email}`);
    }
  } catch (err) {
    console.error("❌ Cron job failed:", err.message);
  }

  },
   {
    timezone: "Asia/Kolkata"
  });
};

module.exports = startDailyReminder;
