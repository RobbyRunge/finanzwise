# 💰 FinanzWise

A personal finance management system built with Symfony 8.0 backend and React frontend.

## 🎯 Project Goal

FinanzWise is a portfolio project demonstrating modern full-stack development:
- **Backend:** Symfony 8.0 + Doctrine ORM + MySQL
- **Frontend:** React 18 + TypeScript + TailwindCSS (planned)
- **Features:** Multi-Account Management, Transaction Tracking, Budget Analytics

## 🚀 Tech Stack

### Backend
- **Framework:** Symfony 8.0
- **PHP:** 8.5.1
- **Database:** MySQL 8.0
- **ORM:** Doctrine 3.6
- **API:** RESTful JSON API (planned)

### Frontend (planned)
- **Library:** React 18
- **Language:** TypeScript
- **Build:** Vite
- **Styling:** TailwindCSS
- **State:** React Context / React Query

## 📁 Project Structure

```
finanzwise/
├── backend/              # Symfony 8.0 API
│   ├── src/
│   │   ├── Controller/   # REST API Endpoints
│   │   ├── Entity/       # Doctrine Entities
│   │   └── Repository/   # Database Queries
│   ├── config/           # Symfony Configuration
│   └── public/           # Entry Point
│
├── frontend/             # React App (coming soon)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
│
└── README.md
```

## 🗄️ Database Schema

### Entities & Relations

```
User
├── id
├── email (unique)
├── password (hashed)
└── createdAt

Account (Financial Accounts)
├── id
├── user_id (FK → User)
├── name (e.g., "Checking Account")
├── balance (DECIMAL)
└── createdAt

Transaction (Income/Expenses)
├── id
├── account_id (FK → Account)
├── amount (DECIMAL)
├── type (income/expense)
├── category
├── description
├── date
└── createdAt
```

**Relations:**
- User → Accounts (1:n)
- Account → Transactions (1:n)

## ✨ Features (MVP)

### ✅ Implemented
- [x] Symfony 8.0 Backend Setup
- [x] MySQL Database Configuration
- [x] Doctrine Entities (User, Account, Transaction)
- [x] Foreign Key Constraints & Relations
- [x] Database Migrations

### 🔄 In Progress
- [ ] REST API Endpoints (CRUD)
- [ ] JWT Authentication
- [ ] React Frontend
- [ ] Dashboard with Charts
- [ ] Budget Tracking

### 📋 Planned
- [ ] CSV Import/Export
- [ ] Categorization with Regex
- [ ] Multi-Currency Support
- [ ] Recurring Transactions

## 🛠️ Installation

### Prerequisites
- PHP 8.4+
- Composer
- MySQL 8.0
- Node.js 18+ (for Frontend)

### Backend Setup

```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/finanzwise.git
cd finanzwise/backend

# Install dependencies
composer install

# Configure .env
cp .env .env.local
# → Adjust DATABASE_URL

# Create database
php bin/console doctrine:database:create

# Create schema
php bin/console doctrine:schema:update --force

# Start development server
php -S localhost:8000 -t public
```

### Frontend Setup (coming soon)

```bash
cd frontend
npm install
npm run dev
```

## 📊 Development Status

**Phase 1: Backend (80% complete)** ✅
- ✅ Symfony Setup
- ✅ Entities & Migrations
- ⏳ API Endpoints
- ⏳ Authentication

**Phase 2: Frontend (0% complete)** 🔜
- ⏳ React Setup
- ⏳ UI Components
- ⏳ API Integration

**Phase 3: Features (0% complete)** 🔜
- ⏳ Dashboard
- ⏳ Reports
- ⏳ CSV Import

## 🤝 Contributing

This is a personal portfolio project. Contributions are welcome!

## 📝 License

This project is created for learning and portfolio purposes.

## 👨‍💻 Author

**Robby**
Portfolio project demonstrating:
- Full-Stack Development
- Symfony 8.0 / Doctrine ORM
- React / TypeScript
- RESTful API Design
- Database Modeling

---

**Created:** February 2026
**Status:** In Development 🚧
