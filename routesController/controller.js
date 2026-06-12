const OpenAI = require("openai");
const routes = require("express").Router();
const taskModel = require("../model/tasksModel");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY, 
  baseURL: "https://integrate.api.nvidia.com/v1",
});

routes.get("/", (req, res) => {
  res.render("login");
});
routes.get("/home", (req, res) => {
  res.render("home");
});
routes.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
routes.post("/login", async (req, res) => {
  const requesteduser = req.body;
  const userExists = await userModel.findOne({ email: requesteduser.email });
  if (userExists) {
    const token = jwt.sign(
      { email: userExists.email, id: userExists._id },
      "secretKey",
    );
    res.cookie("token", token);
    return res.redirect("/home");
  } else {
    const user = await userModel.create({
      username: requesteduser.name,
      email: requesteduser.email,
    });
    const token = jwt.sign({ email: user.email, id: user._id }, "secretKey");
    res.cookie("token", token);
    res.redirect("/home");
  }
});

routes.post("/userData", async (req, res) => {
  const token = req.cookies.token;

  let date1 = new Date(req.body["deadline-date"]);
  let date2 = new Date();
  console.log(req.body);
  const decoded = jwt.verify(token, "secretKey");
  const userData = {
    subjectName: req.body["subject-name"],
    deadline: req.body["deadline-description"],
    goal: req.body["exam-goal"],
    hoursPerDay: req.body["hours-per-day"],
    email: decoded.email,
    days: Math.floor(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24)),
  };
  console.log(userData);
  res.redirect("/home"); // respond immediately

  generateData(userData).catch((err) => {
    console.error("Background AI generation failed:", err.message);
  });
});

async function generateData(userData) {
  const prompt = `Create a day-by-day study roadmap until the given deadline data will be fetched by google app script daily.
INPUT:
Subject: ${userData.subjectName}
Deadline: ${userData.deadline}
Goal: ${userData.goal}
Hours per day: ${userData.hoursPerDay}
number of days until deadline: ${userData.days}
email: ${userData.email}
RULES:
- Divide topics evenly across days
- Keep tasks short and actionable
- Include revision sessions
- Add mock/practice sessions near deadline
- Return concise output, no explanations
OUTPUT:
Return ONLY minified JSON. No markdown, no backticks, no thinking tags.
FORMAT:
[{"date": "YYYY-MM-DD", "task": "Topic or revision task", "duration": "x hours"}]`;

  const completion = await openai.chat.completions.create({
    model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.6,
    top_p: 0.95,
    max_tokens: 65536,
    reasoning_budget: 16384,
    chat_template_kwargs: { enable_thinking: true },
    stream: false,
  });

  const raw = completion.choices[0].message.content;

  // Strip <think>...</think> blocks (reasoning models emit these)
  const withoutThinking = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // Strip markdown fences just in case
  const cleaned = withoutThinking.replace(/```json|```/g, "").trim();

  // Extract the JSON array — find first '[' to last ']'
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) {
    throw new Error("No JSON array found in model response");
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1));
  await saveData(parsed, userData.email, userData.subjectName);
}

async function saveData(dayObjects , email, subject) {
  console.log(email, subject);
  console.log(dayObjects);

  const task = dayObjects.map((obj) => ({
    date: obj.date,
    title: obj.task,
    duration: obj.duration,
  }));
  const userId = await userModel.findOne({ email: email });
  await taskModel.create({
    email: email,
    subject: subject,
    tasks: task,
     userId: userId._id,
  })
}

module.exports = routes;
