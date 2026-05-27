# 🛡️ Cyber Attack Prediction & Risk Assessment System

A modern, interactive, production-grade web application designed for predicting cyber attack risk probabilities, evaluating organizational security gaps, and analyzing machine learning model performances. 

## 🌐 Live Demo

You can view the live application deployed at the following locations:

- **Primary Demo (Vercel):** [https://cyber-attack-prediction.vercel.app/](https://cyber-attack-prediction.vercel.app/)
- **Mirror Demo (GitHub Pages):** [https://abishek8358.github.io/Cyber-attack-prediction/](https://abishek8358.github.io/Cyber-attack-prediction/)

---

## 🚀 Features

The system offers four main functional modules:

1. **📊 Interactive Analytics Dashboard**
   - High-level KPIs (Total Monitored Organizations, High-Risk Count, Average Security Gap, Average Exposure, Attack Rate).
   - Sector-wise risk distributions and state-wise risk distributions.
   - Live network activity status indicators.
   - Clean dark/light theme switching.

2. **🧠 Model Performance Tracker**
   - Head-to-head metrics comparison between multiple ML models (`XGBoost`, `Random Forest`, `SVM`, `Logistic Regression`).
   - Detailed metrics including Accuracy, Precision, Recall, F1-Score, and AUC.
   - Dynamic **ROC Curves** and **Feature Importance** charts to understand decision factors.

3. **🔮 Real-Time Risk Prediction Tool**
   - Interactive input forms to define an organization's parameters (Sector, State, Employee Count, Revenue, Exposure Score, Security Gap, Past Security Incidents).
   - Real-time prediction processing simulating advanced machine learning inference.
   - Comprehensive risk breakdown reports with recommended remediation actions.

4. **🔍 Data Exploration Portal**
   - Detailed threat distributions, victim/safe ratio insights, and data visualization tools.
   - Searchable, paginated data grid showing monitored organizations and their generated predictions.

---

## 🛠️ Technology Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router](https://reactrouter.com/) (using HashRouter for static deployment compatibility)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) & Vanilla CSS for animations
- **Charts**: [Recharts](https://recharts.org/) for highly responsive data visualizations
- **Icons**: [Lucide React](https://lucide.dev/) for clean modern design indicators

---

## 💻 Local Setup and Running

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abishek8358/Cyber-attack-prediction.git
   cd cyber-attack-prediction
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:5173`.

4. **Build the application for production:**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages (Optional):**
   ```bash
   npm run deploy
   ```
