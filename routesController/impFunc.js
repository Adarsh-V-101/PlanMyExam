const OpenAI = require("openai");
const taskModel = require("../model/tasksModel");
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function generateData(userData) {
  console.log("generating data for user:", userData.email); // for debugging

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
[{"dayNumber": integer (e.g. 1, 2, 3), "task": "Topic or revision task", "duration": "x hours"}]`;
  try {
    console.log("sending prompt to model..."); // for debugging
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
    const withoutThinking = raw
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .trim();
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

  } catch (err) {
    console.error("Error during OpenAI completion:", err);
    throw err;
  }
}

async function saveData(dayObjects, email, subject) {
  console.log(email, subject);

  const task = dayObjects.map((obj) => ({
    dayNumber: obj.dayNumber,
    title: obj.task,
    duration: obj.duration,
  }));
  const userId = await userModel.findOne({ email: email });
  const newTaskData = await taskModel.create({
    email: email,
    subject: subject,
    startDate: new Date(),
    tasks: task,
    userId: userId._id,
  });
  userId.taskId.push(newTaskData._id);
  await userId.save();
}

module.exports = {
  generateData,
  saveData,
};
