# 🛍️ E-commerce Product Recommender with AI

An intelligent product recommendation system that combines **AI-powered personalization** with **real-time user interaction tracking**. Built with **React, Node.js, Supabase, and Google Gemini** for seamless recommendations and natural language explanations.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [🔐 Environment Variables](#-environment-variables)
- [📚 API Documentation](#-api-documentation)
- [💡 Usage](#-usage)
- [🌐 Deployment](#-deployment)
- [📁 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
- [🎯 Recommendation Algorithm](#-recommendation-algorithm)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Contact](#-contact)
- [🙏 Acknowledgments](#-acknowledgments)

---

## ✨ Features

### 🎯 Core Functionality

- **Smart Recommendations:** Content-based filtering algorithm that learns from user actions.
- **AI-Powered Explanations:** Google Gemini generates personalized recommendation reasons.
- **Real-Time Tracking:** Monitor product views, cart additions, and purchases.
- **Multi-User Support:** Switch between user profiles seamlessly.
- **Reset Functionality:** Clear interaction history with one click.

### 🎨 User Interface

- **Modern Design:** Sleek, responsive UI built with React + Tailwind CSS.
- **Interactive Dashboard:** Displays real-time statistics and analytics.
- **Product Catalog:** Explore 45+ products across 6 categories.
- **Visual Feedback:** Instant user-action responses.
- **Mobile Responsive:** Fully optimized for all screen sizes.

### 🔧 Technical Features

- **RESTful API:** Well-structured backend endpoints.
- **Supabase Integration:** PostgreSQL cloud database.
- **Scalable Architecture:** Modular backend and frontend structure.
- **Robust Error Handling:** Validations and exceptions covered.
- **Secure Configuration:** Managed environment variables.

---

## 🛠️ Tech Stack

### 🖥️ Frontend

- React 18.2.0
- Tailwind CSS
- Lucide Icons
- Fetch API

### ⚙️ Backend

- Node.js
- Express.js 4.18.2
- Supabase Client 2.39.0
- Google Generative AI (Gemini)
- CORS

### 🗄️ Database

- Supabase (PostgreSQL)
- SQL

### 🤖 AI/ML

- Google Gemini Pro – LLM for explanations
- Content-Based Filtering – Recommendation engine

### ☁️ DevOps

- Git / GitHub
- npm

---

## ⚙️ Architecture

```text
User Interaction → Supabase Storage → Recommendation Engine → Gemini AI → Frontend Display
```

1. User interacts with products.
2. Interactions are saved in Supabase.
3. Backend computes recommendations using content-based filtering.
4. Gemini generates natural language explanations.
5. UI displays intelligent recommendations.

---

## 🚀 Installation

### 🧩 Prerequisites

- Node.js ≥ 16
- npm ≥ 8
- Supabase account
- Google Gemini API key

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/ecommerce-recommender-ai.git
cd ecommerce-recommender-ai
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

Start server:

```bash
npm start
```

✅ Backend running at [http://localhost:5000](http://localhost:5000)

### 3️⃣ Setup Database

- Create project on [Supabase](https://supabase.com)
- Go to **SQL Editor → Run** schema from `supabase/schema.sql`
- Copy your **Project URL** and **anon key** into `.env`

### 4️⃣ Setup Frontend

```bash
cd ../frontend
npm install
```

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm start
```

✅ Frontend running at [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable       | Description          | Example                 |
| -------------- | -------------------- | ----------------------- |
| PORT           | Server port          | 5000                    |
| SUPABASE_URL   | Supabase project URL | https://xyz.supabase.co |
| SUPABASE_KEY   | Supabase anon key    | eyJhbGci...             |
| GEMINI_API_KEY | Gemini API key       | AIzaSy...               |

### Frontend (`frontend/.env`)

| Variable          | Description     | Example                   |
| ----------------- | --------------- | ------------------------- |
| REACT_APP_API_URL | Backend API URL | http://localhost:5000/api |

---

## 📚 API Documentation

**Base URL:** `http://localhost:5000/api`

| Endpoint                     | Method | Description                    |
| ---------------------------- | ------ | ------------------------------ |
| `/health`                    | GET    | Check server health            |
| `/products`                  | GET    | Get all products               |
| `/products/:id`              | GET    | Get product by ID              |
| `/recommendations/:userId`   | GET    | Get AI-powered recommendations |
| `/interactions`              | POST   | Log user interactions          |
| `/interactions/user/:userId` | GET    | Get user’s interactions        |
| `/interactions/user/:userId` | DELETE | Reset user interactions        |

**Interaction Types:**  
`view`, `cart`, `purchase`

---

## 💡 Usage

### For End Users

- Browse the product catalog
- Click “View,” “Add to Cart,” or “Buy Now”
- Get recommendations with AI-generated reasons
- Switch users or reset history anytime

### For Developers

**Add Products:**

```sql
INSERT INTO products (name, category, price, description, popularity)
VALUES ('New Product', 'Electronics', 99.99, 'Amazing product description', 75);
```

**Customize Algorithm:**  
`backend/services/recommender.js`

```js
if (userCategories.has(product.category)) score += 2.0;
if (product.price < 50) score += 0.5;
```

**Modify AI Prompts:**  
`backend/services/llmService.js`

```js
const prompt = `Your custom prompt here...`;
```

---

## 🌐 Deployment

### Backend (Vercel)

- Import backend folder into Vercel
- Root Directory: `backend`
- Build Command: `npm install`
- Add environment variables
- Deploy

### Frontend (Vercel)

- Import frontend folder
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`
- Add environment variables
- Deploy

📘 See `DEPLOYMENT.md` for detailed steps.

---

## 📁 Project Structure

```
ecommerce-recommender-ai/
├── backend/
│   ├── config/supabase.js
│   ├── routes/{products,recommendations,interactions}.js
│   ├── services/{recommender,llmService}.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/index.html
│   ├── src/{App.jsx,index.js,index.css}
│   ├── package.json
│   └── .env.example
│
├── supabase/schema.sql
├── DEPLOYMENT.md
├── LICENSE
└── README.md
```

---

## 🧪 Testing

**Manual Testing**

```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/products
curl -X POST http://localhost:5000/api/interactions  -H "Content-Type: application/json"  -d '{"user_id":"user1","product_id":1,"interaction_type":"view"}'
curl http://localhost:5000/api/recommendations/user1
```

**Frontend Testing**

- Visit http://localhost:3000
- Interact with products
- Generate recommendations
- Switch users / reset stats

---

## 👤 Contact

**Your Name** – [Namokar Jain](https://github.com/Namokar05)  
📧 Email: namokar.jain2004@gmail.com  
🔗 Project: [GitHub Repo](https://github.com/Namokar05/ecommerce-recommender-ai)

---

## Acknowledgments

- [Supabase](https://supabase.com) – Backend as a Service
- [Google Gemini](https://ai.google.dev) – Large Language Model
- [Vercel](https://vercel.com) – Hosting Platform
- [Tailwind CSS](https://tailwindcss.com) – Styling Framework
- [Lucide Icons](https://lucide.dev) – Icon Library
- [React](https://react.dev) – UI Framework
- [Express.js](https://expressjs.com) – Backend Framework

---
