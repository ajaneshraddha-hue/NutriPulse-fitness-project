# ⚡ NutriPulse AI - Intelligent Nutrition & WhatsApp Coaching Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.16-339933.svg?logo=node.js)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-Native_Sync-003B57.svg?logo=sqlite)](https://www.sqlite.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Deep_Link_API-25D366.svg?logo=whatsapp)](https://www.whatsapp.com/)

**NutriPulse AI** is a next-generation consumer nutrition, workout tracking, and multi-tenant fitness web application built according to the **FitLife AI Nutrition Engine Product Specification**. It features clinical nutrition calculation, authentic Indian meal planning, photo-based food scanning, workout burn tracking, and a **dynamically bound WhatsApp AI Coach** that connects members directly to their partner fitness club's registered phone number.

---

## 🌟 Key Capabilities

### 1. 🏢 Multi-Tenant Partner Admin Gateway (Hidden & Secure)
- **Isolated Enterprise Portal**: Accessible via `🔐 Partner Admin Gateway` in the footer.
- **Brand Identity Customization**: Firm Name, Brand Logo URL, WhatsApp Number, Full Address, Tagline, AI Bot Persona Name, and Welcome Message.
- **Session Protection**: Gated with enterprise tokens (`ADM_TOKEN_*`) and SQLite persistence.
- **Live Preview & Outreach**: Real-time view of how members see the club brand and 1-click WhatsApp broadcast templates (*Weekly Weigh-in, Hydration Nudge, Dining Out Strategy*).

### 2. 👤 3-Step Guided Member Onboarding & Safety Screening
- **Step 1**: Account credentials & Partner Club selection.
- **Step 2**: Body baseline (*Age, Gender, Height, Current Weight, Target Weight, Waist circumference, Weekly Workouts*).
- **Step 3**: Diet preferences (*Veg, Non-veg, Eggetarian, Vegan, Jain*) and Regional Cuisine (*North Indian, South Indian, Mixed*).
- **Clinical Safety Screening (PDF Section 4)**: Evaluates conditions (Diabetes, Blood Pressure, Thyroid) and assigns safety flags (🟢 Green / 🟡 Yellow / 🔴 Red).

### 3. 🧮 Clinical Nutrition Engine (Mifflin-St Jeor TDEE)
- **Basal Metabolic Rate (BMR)** and **TDEE** dynamically calculated using activity multipliers.
- **Goal Budgets**:
  - *Fat-loss*: $\text{TDEE} - 450\text{ kcal}$
  - *Muscle-gain*: $\text{TDEE} + 350\text{ kcal}$
  - *Maintenance*: $\text{TDEE}$
- **Macro Split**: Protein ($1.8\text{--}2.0\text{ g/kg}$), Fats ($25\%$), Carbohydrates (balance), Fiber ($14\text{g}/1000\text{ kcal}$), and Hydration ($35\text{ ml/kg}$).

### 4. 📊 Calorie Budget Wheel & Net Calorie Math
- Animated circular progress ring showing net calories remaining.
- **Net Calorie Formula**:
  $$\text{Net Calories} = \text{Calories Consumed} - \text{Calories Burned}$$
  Burned workout calories automatically expand the daily net allowance safely!

### 5. 🍛 Authentic Indian Meal Plans & 1-Click AI Swaps (PDF Section 7, 8 & 9)
- 5 daily structured slots (*Breakfast, Morning Snack, Balanced Lunch, Pre/Post-Workout, Dinner*).
- Pre-seeded with 50+ standardized Indian dishes (*Moong Dal Chilla, Idli & Sambar, Phulkas + Dal Tadka, Paneer Bhurji, Curd Rice, Sprouts, Makhana*).
- **AI Swap Engine**: Proposes 3 nutritionally equivalent Indian alternatives with matched calories ($\pm 100\text{ kcal}$).

### 6. 📷 AI Food Scanner (Photo Recognition - PDF Section 10)
- Simulates plate recognition with dish detection and confidence scoring (e.g. *94% High*).
- Interactive portion adjustment slider ($0.5\times$ to $2.0\times$) and instant 1-click logging.

### 7. 🏋️‍♂️ Workout & Calorie Burn Tracker
- Log exercises (*Strength Training, HIIT, Running, Cycling, Brisk Walking, Yoga*).
- Automated MET-based calorie burn calculation credited directly to the net budget.

### 8. 🍲 High-Protein Indian Recipe Cooking Guides
- Step-by-step recipes with prep time, cook time, ingredients with measurements, numbered instructions, and nutritionist tips.

### 9. 🛒 Smart Weekly Grocery & Pantry Checklist
- Auto-generated weekly shopping list categorized into *Pulses & Staples, Fresh Proteins & Dairy, Whole Grains, and Produce* with interactive check-off checkboxes.

### 10. 📏 Clinical BMI & Target Timeline Calculator
- Real-time BMI category classification (*Underweight, Normal, Overweight, Obese*).
- Timeline prediction calculating estimated weeks to target weight at safe $0.5\text{ kg/week}$ pace.

### 11. 💬 Dynamic WhatsApp AI Agent
- Floating widget linked directly to the registered admin's WhatsApp number.
- Generates click-to-chat deep links (`https://wa.me/{number}`) with customer context pre-filled.
- Embedded in-app conversational AI coach with quick prompt shortcuts.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js 24 REST API with native SQLite (`node:sqlite`).
- **Database**: Single-file persistent SQLite database (`fitlife.db`).
- **WhatsApp Integration**: Deep-link URL protocol (`wa.me`) with dynamic parameter binding.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v20+ or v24+
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
cd <YOUR_REPO_NAME>
```

### 2. Install Dependencies
```bash
# Install backend dependencies (optional, native modules used)
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Start the Application
In separate terminal windows:

**Terminal 1 - Backend Server (Port 5000):**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend App (Port 5173):**
```bash
cd frontend
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🧪 Quick Test Credentials

| Portal | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Member Portal** | `rahul.sharma@example.com` | `user123` | Customer with meal plan & logs |
| **Partner Admin** | `apex@nutripulse.in` | `admin123` | Hub owner with WhatsApp config |

---

## 📂 Project Directory Structure

```
├── backend/
│   ├── server.js          # REST API & Business Logic
│   ├── db.js              # Native SQLite Schema & Seeding
│   ├── fitlife.db         # Persistent SQLite Database
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation & active session
│   │   │   ├── CustomerPortal.jsx      # HealthifyMe-style member dashboard
│   │   │   ├── AdminPortal.jsx         # Isolated club owner console
│   │   │   ├── AuthModal.jsx           # Unified member & admin login/signup
│   │   │   ├── WhatsAppAgentWidget.jsx # WhatsApp AI floating drawer
│   │   │   └── Footer.jsx              # Footer with hidden admin gateway
│   │   ├── App.jsx                     # Root application container
│   │   ├── index.css                   # Tailwind & animation directives
│   │   └── main.jsx                    # React mount
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── documentation.html     # Printable & PDF exportable documentation
├── test-v2.js             # Automated integration test suite
└── README.md
```

---

## 📄 License
This project is licensed under the MIT License.
