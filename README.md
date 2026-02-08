# 💰 FinanzWise

A personal finance management system built with Symfony 8.0 backend and React 18 frontend.

## 🎯 Project Goal

FinanzWise is a portfolio project demonstrating modern full-stack development:
- **Backend:** Symfony 8.0 + Doctrine ORM + MySQL
- **Frontend:** React 18 + TypeScript + TailwindCSS
- **Features:** Multi-Account Management, Transaction Tracking, Financial Summaries

## 🚀 Tech Stack

### Backend
- **Framework:** Symfony 8.0
- **PHP:** 8.5.1
- **Database:** MySQL 8.0
- **ORM:** Doctrine 3.6
- **API:** RESTful JSON API

### Frontend
- **Library:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite 7.3
- **Styling:** TailwindCSS 3
- **Routing:** React Router 6
- **HTTP Client:** Axios

## 📁 Project Structure

```
finanzwise/
├── backend/              # Symfony 8.0 API
│   ├── src/
│   │   ├── Controller/   # REST API Endpoints (UserController, AccountController, TransactionController)
│   │   ├── Entity/       # Doctrine Entities (User, Account, Transaction)
│   │   └── Repository/   # Database Queries
│   ├── config/           # Symfony Configuration
│   └── public/           # Entry Point
│
├── frontend/             # React 18 App
│   ├── src/
│   │   ├── components/   # Reusable Components (Navigation)
│   │   ├── pages/        # Page Components (Dashboard, Users, Accounts, Transactions)
│   │   ├── services/     # API Service Layer (Axios)
│   │   ├── App.tsx       # Main App with Routing
│   │   └── main.tsx      # Entry Point
│   ├── public/
│   └── package.json
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

### ✅ Backend (Implemented)
- [x] Symfony 8.0 Backend Setup
- [x] MySQL Database Configuration
- [x] Doctrine Entities (User, Account, Transaction)
- [x] Foreign Key Constraints & Relations
- [x] Database Migrations
- [x] REST API Endpoints (CRUD) - 18 Endpoints
- [x] User Management API (5 endpoints)
- [x] Account Management API (6 endpoints)
- [x] Transaction Management API (7 endpoints)
- [x] Financial Summaries (Income/Expense/Balance)
- [x] BC Math for precise financial calculations

### ✅ Frontend (Implemented)
- [x] React 18 + TypeScript Setup with Vite
- [x] TailwindCSS Styling
- [x] React Router Navigation
- [x] TypeScript API Service Layer
- [x] Dashboard Page (Overview with Statistics)
- [x] Users Management Page (Create, List, Delete)
- [x] Accounts Management Page (Create, List, Delete)
- [x] Transactions Management Page (Create, List, Delete with Summaries)
- [x] Responsive Design
- [x] Navigation Component

### 🔄 In Progress
- [ ] JWT Authentication
- [ ] Edit Functionality for all entities
- [ ] Dashboard Charts (Income/Expense visualization)

### 📋 Planned
- [ ] Budget Tracking
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

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will run on http://localhost:5173
```

**Important:** Make sure the backend is running on `http://localhost:8000` before starting the frontend.

## 🎮 Usage

1. **Start Backend:**
   ```bash
   cd backend
   php -S localhost:8000 -t public
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser:**
   Navigate to `http://localhost:5173`

### Frontend Pages

- **Dashboard (/)** - Overview with user count, account balance, transactions, income vs expense
- **/users** - Manage users (create, list, delete)
- **/accounts** - Manage accounts (create, list, delete)
- **/transactions** - Manage transactions (create, list, delete with summaries)

## 📊 Development Status

**Phase 1: Backend (100% complete)** ✅
- ✅ Symfony Setup
- ✅ Entities & Migrations
- ✅ API Endpoints (18 total)
- ⏳ Authentication (JWT planned)

**Phase 2: Frontend (80% complete)** ✅
- ✅ React + TypeScript Setup
- ✅ UI Components
- ✅ API Integration
- ✅ All CRUD Pages
- ⏳ Edit Functionality
- ⏳ Charts & Visualizations

**Phase 3: Features (10% complete)** 🔜
- ✅ Financial Summaries
- ⏳ Dashboard Charts
- ⏳ Budget Tracking
- ⏳ CSV Import

## 🏗️ Architecture & Design Decisions

### Backend
- **DECIMAL for Money:** Using `DECIMAL(10,2)` instead of FLOAT to avoid rounding errors in financial calculations
- **BC Math Functions:** Using `bcadd()` and `bcsub()` for precise financial arithmetic
- **Doctrine ORM:** Foreign key relations with `ManyToOne` annotations
- **RESTful API:** Consistent endpoint structure with proper HTTP methods
- **Environment Security:** Separation of `.env` (template) and `.env.local` (actual credentials)

### Frontend
- **Vite Build Tool:** Fast HMR (Hot Module Replacement) and optimized production builds
- **TypeScript:** Type safety, interfaces for API responses, better IDE support
- **Type-Only Imports:** Using `import type` for interfaces to optimize bundle size
- **TailwindCSS v3:** Utility-first CSS for rapid UI development
- **Centralized API Service:** Single `api.ts` file with all backend endpoints and type definitions
- **React Router:** Client-side routing for SPA (Single Page Application) experience

## 📸 Screenshots

### Dashboard
- Overview cards showing total users, accounts, balance, and transactions
- Income vs Expense comparison
- Recent transactions table

### Management Pages
- Users: Create and manage user accounts
- Accounts: Link accounts to users with initial balance
- Transactions: Record income/expense with categories and descriptions

## 🤝 Contributing

This is a personal portfolio project. Contributions are welcome!

## 📝 License

This project is created for learning and portfolio purposes.

## 👨‍💻 Author

**Robby**

Portfolio project demonstrating:
- **Full-Stack Development** (Frontend + Backend + Database)
- **Backend:** Symfony 8.0, Doctrine ORM, RESTful API Design
- **Frontend:** React 18, TypeScript, Modern UI with TailwindCSS
- **Database:** MySQL, Relational Database Design, Foreign Key Constraints
- **Best Practices:** Type Safety, Financial Precision, Environment Security
- **Tools:** Vite, Composer, Git

### Skills Demonstrated
✅ PHP 8.5 & Symfony 8.0
✅ React 18 & TypeScript
✅ MySQL & Doctrine ORM
✅ RESTful API Design
✅ Database Modeling & Relations
✅ Financial Calculations (BC Math)
✅ Modern Frontend (Vite + TailwindCSS)
✅ Git Version Control

---

**Created:** February 2026
**Status:** Active Development 🚀
**Frontend:** ✅ Implemented
**Backend:** ✅ Implemented
**Next:** JWT Authentication & Dashboard Charts
