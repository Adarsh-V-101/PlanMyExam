
# 📚 PlanMyExam

**AI-powered exam study planner — generates personalized study schedules using NVIDIA Nemotron**


---

## 🧩 What is this?

PlanMyExam lets students input their subjects, exam dates, and available study hours — and instantly generates a day-by-day AI study plan tailored to their schedule. The app handles async AI generation via polling, sends daily revision reminders over email, and keeps everything tied to a secure JWT + OTP auth system.

---

## ✨ Features

- 🤖 **AI Study Plan Generation** — Uses the NVIDIA Nemotron API to create personalized multi-day study schedules
- ⏳ **Async Polling Architecture** — AI generation runs in the background; frontend polls for the result (no SSE, no blocking)
- 🔐 **OTP-Based Authentication** — Email OTP verification on signup/login via Nodemailer
- 📅 **Daily Email Reminders** — Automated daily study reminders using `node-cron` + Nodemailer
- 🔒 **Security Hardened** — Fixed IDOR vulnerability (users can only access their own plans) and patched OTP bypass
- 🎨 **Clean Dark UI** — Dark indigo/violet theme with glassmorphic nav and toast notifications

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + OTP (Nodemailer) |
| AI | NVIDIA Nemotron API |
| Scheduling | node-cron |
| Email | Nodemailer |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- NVIDIA API key ([get one here](https://build.nvidia.com))
- A Gmail account (for Nodemailer — enable App Passwords)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Adarsh-V-101/PlanMyExam.git
cd PlanMyExam

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env

# 4. Start the server
npm start
```

### Environment Variables

Create a `.env` file in the root with the following:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

NVIDIA_API_KEY=your_nvidia_api_key
```

> ⚠️ Never commit your `.env` file. It's in `.gitignore`.

---

## 📁 Project Structure

```
PlanMyExam/
├── controllers/       # Route logic (auth, plans, reminders)
├── middleware/        # JWT auth middleware
├── models/            # Mongoose schemas (User, Plan)
├── routes/            # Express route definitions
├── utils/             # Nodemailer setup, cron jobs
├── public/            # Frontend (HTML/CSS/JS)
├── .env.example       # Sample env file
└── server.js          # Entry point
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register with OTP verification |
| POST | `/api/auth/verify-otp` | Verify OTP and get JWT |
| POST | `/api/auth/login` | Login |
| POST | `/api/plans/generate` | Trigger AI plan generation |
| GET | `/api/plans/status/:jobId` | Poll generation status |
| GET | `/api/plans/my-plans` | Get all plans for logged-in user |

---

## 🔐 Security Notes

- All plan routes are protected with JWT middleware
- IDOR patch: users can only read/write their own plans — no ID guessing
- OTP is single-use and expires after 10 minutes

---

## 🧠 How Async Generation Works

```
User submits form
      │
      ▼
Server queues job → returns jobId immediately
      │
      ▼
NVIDIA Nemotron API processes in background
      │
      ▼
Frontend polls GET /api/plans/status/:jobId every 3s
      │
      ▼
On completion → plan saved to MongoDB → returned to user
```

---

## 📬 Contact

Made by [Adarsh Vishwakarma](https://github.com/Adarsh-V-101)
