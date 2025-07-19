# 🏆 Leaderboard App

A beautifully styled real-time leaderboard app built with **React**, **Node.js**, **MongoDB**, and **Express**. Users can claim points, view live rankings (daily/monthly), and enjoy dynamic UI elements like floating sparkles and ribbons.

## ✨ Features

- 🔄 Real-time Leaderboard (Daily / Monthly filters)
- 🎯 Claim points (Hourly)
- 🥇 Top 3 Podium Display
- 🧑‍💼 User Management (Add / Edit)
- 🔍 Search & Filter users
- 🎁 Floating animations: sparkles + ribbons
- 🖌️ Unique golden-themed UI with background stripes

---

## 🚀 Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS
- Framer Motion
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/leaderboard-app.git
cd leaderboard-app

### 2. Install Dependencies

```bash
BACKEND:
cd backend
npm install
npm run dev

FRONTEND:
cd frontend
npm install
npm run dev

## API Endpoints
GET /users – fetch all users

GET /users/leaderboard?period=daily|monthly – leaderboard by time

POST /users – add user

PATCH /users/:id – edit user

POST /claim – claim points

GET /history – get claim history

## Folder Structure
frontend/
  ├── src/
  │   ├── components/
  │   ├── utils/
  │   ├── App.jsx
  │   ├── main.jsx
  │   └── index.css
backend/
  ├── models/
  ├── routes/
  ├── controllers/
  ├── server.js

## Author
Shubh Kumar