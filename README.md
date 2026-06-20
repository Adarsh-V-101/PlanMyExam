# PlanMyExam 📚

An AI-powered exam study planner that takes your subjects, deadlines, and available hours — and generates a personalized day-by-day study schedule using a reasoning LLM, streamed in real time.

> 🚧 Work in progress — core features are functional, final polish in progress.

---

## Features

- **AI Schedule Generation** — Powered by NVIDIA Nemotron (reasoning model via OpenAI-compatible API), generates structured study plans tailored to your exam timeline
- **Real-time Streaming** — Schedule streams to the UI via Server-Sent Events (SSE) as the AI reasons through your plan
- **JWT Authentication** — Secure login/signup with JSON Web Tokens
- **OTP Email Verification** — Email-based OTP flow using Nodemailer
- **Task Management** — Save, view, and track your generated study tasks in MongoDB
- **Scheduled Reminders** — node-cron handles time-based study reminders

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Auth | JWT, OTP via Nodemailer |
| AI | NVIDIA Nemotron (OpenAI-compatible client) |
| Real-time | Server-Sent Events (SSE) |
| Templating | EJS |
| Scheduling | node-cron |

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (Atlas)
- NVIDIA API key (for Nemotron model)
- SMTP credentials (for Nodemailer OTP)

### Installation

```bash
git clone https://github.com/Adarsh-V-101/PlanMyExam.git
cd PlanMyExam
npm install
```

Create a `.env` file in the root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NVIDIA_API_KEY=your_nvidia_api_key
EMAIL=your_email@gmail.com
PASS=your_app_password
```

Start the server:

```bash
npm run dev
```

---

## Project Structure

```
PlanMyExam/
├── model/              # Mongoose schemas (User, Task)
├── routesController/   # Express routes + controllers
├── utilities/          # Helpers (JWT, mailer, AI client)
├── views/              # EJS templates
├── public/             # Static assets (CSS, JS)
└── app.js              # Entry point
```

---

## Known Challenges

The NVIDIA Nemotron reasoning model wraps its output in `<think>...</think>` blocks before producing the actual JSON. Stripping these cleanly while maintaining SSE stream integrity was the trickiest part of this project.

---

## Roadmap

- [ ] Dashboard with progress tracking
- [ ] Edit/reschedule generated tasks
- [ ] Mobile-responsive UI polish
- [ ] Deployed demo

---

## Author

**Adarsh V** — Final-year B.Tech student | [GitHub](https://github.com/Adarsh-V-101)
