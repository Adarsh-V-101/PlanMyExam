// Move client init outside — created once
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

routes.post("/userData", async (req, res) => {
  const subjectName = req.body["subject-name"];
  const deadline = req.body["deadline-description"];
  const goal = req.body["exam-goal"];
  const hoursPerDay = req.body["hours-per-day"];
  const email = req.body["email"]; // collect this too

  const userData = { subjectName, deadline, goal, hoursPerDay, email };

  try {
    await generateData(userData); // await it, don't fire-and-forget
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message }); // now res is in scope
  }
});

async function saveData(dayObjects, email) {
  // AI returns an array — save each day separately
  const docs = dayObjects.map((day) => ({
    date: day.date,
    email: email,
    tasks: day.tasks,
  }));
  await taskModel.insertMany(docs);
}

async function generateData(userData) {
  // ...prompt stays the same...

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
  console.log("Raw AI response:", raw);

  const parsed = JSON.parse(raw); // parse the string → array of day objects
  await saveData(parsed, userData.email);
}