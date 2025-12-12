# AI Financial Market Intelligence Platform  
Advanced Real-Time Analytics • AI Forecasting • Market Intelligence • News Sentiment • Portfolio Engine

This platform provides a full-stack, real-time financial analytics system with AI-driven indicators, forecasting, live charts, portfolio management, news sentiment, and an AI assistant.  
Built using **FastAPI + PostgreSQL + React + Tailwind + Recharts**.

---

# 🚀 Features

### 🔹 Market Data & Analytics
- Live stock prices (1-minute updates)
- Historical OHLCV data
- Candlestick & line chart visualizations
- Technical indicators (RSI, MACD, SMA, EMA)
- Algorithmic signal engine

### 🔹 AI & Intelligence
- AI Forecasting (LSTM / Prophet)
- AI Pattern Recognition
- AI Financial Assistant (NLP Querying)
- News Sentiment Engine

### 🔹 User & Authentication
- Signup / Login with JWT
- Profile page (account info, security, API key)
- API key generation & rotation

### 🔹 Portfolio Management
- Track holdings, P&L, sharpe, exposure  
- Risk & performance analysis  

### 🔹 Fully Modular Backend
- FastAPI micro-services
- APScheduler real-time jobs
- PostgreSQL persistence

### 🔹 Modern Frontend (React)
- Fully responsive dashboard
- Beautiful Tailwind UI
- Live charts (Recharts)
- AI assistant chat UI
- Profile settings & account center

---

# ⚙️ **Tech Stack**

### **Backend**
- FastAPI  
- SQLAlchemy  
- PostgreSQL  
- APScheduler  
- JWT Authentication  
- yFinance / custom market data  
- NLP sentiment (Transformers optional)

### **Frontend**
- React (Vite)
- TailwindCSS
- Recharts
- Lucide Icons

---

# 📦 **1. Installation & Setup**

## ✅ A. Clone Repository
```bash
git clone https://github.com/yourname/ai-market-intelligence.git
cd ai-market-intelligence
📌 2. Backend Setup (FastAPI)
Navigate to backend folder:

bash
Copy code
cd backend
🔧 A. Create Virtual Environment
bash
Copy code
python -m venv venv
venv\Scripts\activate
🔧 B. Install Dependencies
bash
Copy code
pip install -r requirements.txt
If you don’t have a requirements.txt, use:

bash
Copy code
pip install fastapi uvicorn sqlalchemy psycopg2-binary bcrypt python-jose python-dotenv apscheduler requests yfinance
🗄️ C. PostgreSQL Setup
Create database:
sql
Copy code
CREATE DATABASE marketdb;
Users Table (for Signup/Login)
sql
Copy code
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR,
    email VARCHAR UNIQUE,
    password_hash VARCHAR
);
⚙️ D. Environment Variables (.env)
Create:

bash
Copy code
backend/.env
Add:

ini
Copy code
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost/marketdb
JWT_SECRET=your_super_secret_key
▶️ E. Run Backend
bash
Copy code
uvicorn app.main:app --reload
Backend running at:
👉 http://127.0.0.1:8000

API Docs:
👉 http://127.0.0.1:8000/docs

🎨 3. Frontend Setup (React)
Move to frontend:

bash
Copy code
cd frontend
🔧 Install Node Modules
bash
Copy code
npm install
▶️ Run Frontend
bash
Copy code
npm run dev
App runs at:
👉 http://localhost:5173

🧱 4. Project Structure
pgsql
Copy code
ai-market-intelligence/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── __init__.py
│   │   ├── models/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   ├── api/
│   │   │   ├── prices.py
│   │   │   ├── symbols.py
│   │   │   ├── news.py
│   │   │   ├── forecast.py
│   │   │   ├── indicators.py
│   │   │   ├── sentiment.py
│   │   │   ├── signals.py
│   │   │   ├── portfolio.py
│   │   │   └── voice.py
│   │   ├── services/
│   │   │   └── scheduler_live.py
│   │   └── static/
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Profile.jsx
    │   │   └── Assistant.jsx
    │   ├── components/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
🔐 5. Authentication Flow
Signup
bash
Copy code
POST /api/auth/signup
Login → Returns JWT
bash
Copy code
POST /api/auth/login
Store token in:
javascript
Copy code
localStorage.setItem("access_token", token)
Attach token to private routes:
makefile
Copy code
Authorization: Bearer <token>
🛠️ 6. Start Live Market Scheduler
APScheduler auto-starts:

Updates intraday prices every 1 minute

Saves into DB

Used by charts & indicators


✅ 1. Start PostgreSQL (Required)

Make sure PostgreSQL service is running.

Check (Windows):

services.msc


Start:

PostgreSQL Server

🟦 2. Start Backend (FastAPI)
Open Terminal inside:
D:\6. PROJECT FOLDER\ai-market-intelligence\backend

➤ Create & Activate Virtual Environment

(Do this ONLY once)

python -m venv venv
venv\Scripts\activate

➤ Install Dependencies

(Only the first time)

pip install -r requirements.txt

➤ RUN BACKEND

(Every time you start project)

uvicorn app.main:app --reload


Backend runs at:

👉 http://127.0.0.1:8000

API Docs:

👉 http://127.0.0.1:8000/docs

🟩 3. Start Frontend (React / Vite)
Open another terminal inside:
D:\6. PROJECT FOLDER\ai-market-intelligence\frontend

➤ Install Node modules

(Only the first time)

npm install

➤ RUN FRONTEND

(Every time you start project)

npm run dev


Frontend runs at:

👉 http://localhost:5173/

🎉 Summary of Commands
🔧 One-time Setup:
python -m venv venv
venv\Scripts\activate
pip install -r backend\requirements.txt
npm install --prefix frontend

🚀 Run App Daily:

Open two terminals

Terminal 1 → Backend:
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload

Terminal 2 → Frontend:
cd frontend
npm run dev

🟣 Want a single scrip"# AI-Finance-Market-Intelligence" 
