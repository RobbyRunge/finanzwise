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

## 🔌 API Endpoints

### User Endpoints
```
GET    /api/users           - Get all users
GET    /api/users/{id}      - Get single user
POST   /api/users           - Create user
PUT    /api/users/{id}      - Update user
DELETE /api/users/{id}      - Delete user
```

### Account Endpoints
```
GET    /api/accounts                - Get all accounts
GET    /api/accounts/{id}           - Get single account
POST   /api/accounts                - Create account
PUT    /api/accounts/{id}           - Update account
DELETE /api/accounts/{id}           - Delete account
GET    /api/accounts/user/{userId}  - Get all accounts for a user (with total balance)
```

### Transaction Endpoints
```
GET    /api/transactions                     - Get all transactions
GET    /api/transactions/{id}                - Get single transaction
POST   /api/transactions                     - Create transaction
PUT    /api/transactions/{id}                - Update transaction
DELETE /api/transactions/{id}                - Delete transaction
GET    /api/transactions/account/{accountId} - Get transactions for account (with summary)
GET    /api/transactions/type/{type}         - Filter by type (income/expense)
```

**Example Request (Create Transaction):**
```bash
POST /api/transactions
Content-Type: application/json

{
  "accountId": 1,
  "amount": "100.50",
  "type": "income",
  "category": "Salary",
  "description": "Monthly salary",
  "date": "2026-02-06"
}
```

**Example Response (Account Summary):**
```json
{
  "accountId": 1,
  "accountName": "Checking Account",
  "transactions": [...],
  "summary": {
    "totalIncome": "2500.00",
    "totalExpense": "925.50",
    "balance": "1574.50",
    "count": 3
  }
}
```

## ✨ Features (MVP)

### ✅ Implemented
- [x] Symfony 8.0 Backend Setup
- [x] MySQL Database Configuration
- [x] Doctrine Entities (User, Account, Transaction)
- [x] Foreign Key Constraints & Relations
- [x] Database Migrations
- [x] REST API Endpoints (CRUD) - 18 Endpoints
- [x] User Management API
- [x] Account Management API
- [x] Transaction Management API
- [x] Financial Summaries (Income/Expense/Balance)

### 🔄 In Progress
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
