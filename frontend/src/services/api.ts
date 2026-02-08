import axios from 'axios';

// Base URL for Symfony Backend
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== USER API ====================

export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
}

export const userApi = {
  // GET /api/users - Get all users
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  // GET /api/users/{id} - Get single user
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  // POST /api/users - Create new user
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  // PUT /api/users/{id} - Update user
  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // DELETE /api/users/{id} - Delete user
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },
};

// ==================== ACCOUNT API ====================

export interface Account {
  id: number;
  userId: number;
  userEmail: string;
  name: string;
  balance: string;
  createdAt: string;
}

export interface CreateAccountRequest {
  userId: number;
  name: string;
  balance?: string;
}

export interface UpdateAccountRequest {
  name?: string;
  balance?: string;
  userId?: number;
}

export interface UserAccountsResponse {
  userId: number;
  userEmail: string;
  accounts: Account[];
  totalBalance: string;
}

export const accountApi = {
  // GET /api/accounts - Get all accounts
  getAll: async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>('/accounts');
    return response.data;
  },

  // GET /api/accounts/{id} - Get single account
  getById: async (id: number): Promise<Account> => {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  // POST /api/accounts - Create new account
  create: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await apiClient.post<Account>('/accounts', data);
    return response.data;
  },

  // PUT /api/accounts/{id} - Update account
  update: async (id: number, data: UpdateAccountRequest): Promise<Account> => {
    const response = await apiClient.put<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  // DELETE /api/accounts/{id} - Delete account
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/accounts/${id}`);
    return response.data;
  },

  // GET /api/accounts/user/{userId} - Get all accounts for a user
  getByUserId: async (userId: number): Promise<UserAccountsResponse> => {
    const response = await apiClient.get<UserAccountsResponse>(`/accounts/user/${userId}`);
    return response.data;
  },
};

// ==================== TRANSACTION API ====================

export interface Transaction {
  id: number;
  accountId: number;
  accountName: string;
  userId: number;
  userEmail: string;
  amount: string;
  type: 'income' | 'expense';
  category: string | null;
  description: string | null;
  date: string;
  createdAt: string;
}

export interface CreateTransactionRequest {
  accountId: number;
  amount: string;
  type: 'income' | 'expense';
  category?: string;
  description?: string;
  date?: string;
}

export interface UpdateTransactionRequest {
  accountId?: number;
  amount?: string;
  type?: 'income' | 'expense';
  category?: string;
  description?: string;
  date?: string;
}

export interface AccountTransactionsResponse {
  accountId: number;
  accountName: string;
  transactions: Transaction[];
  summary: {
    totalIncome: string;
    totalExpense: string;
    balance: string;
    count: number;
  };
}

export interface TransactionsByTypeResponse {
  type: 'income' | 'expense';
  transactions: Transaction[];
  total: string;
  count: number;
}

export const transactionApi = {
  // GET /api/transactions - Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>('/transactions');
    return response.data;
  },

  // GET /api/transactions/{id} - Get single transaction
  getById: async (id: number): Promise<Transaction> => {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  // POST /api/transactions - Create new transaction
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  },

  // PUT /api/transactions/{id} - Update transaction
  update: async (id: number, data: UpdateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  // DELETE /api/transactions/{id} - Delete transaction
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/transactions/${id}`);
    return response.data;
  },

  // GET /api/transactions/account/{accountId} - Get transactions for account
  getByAccountId: async (accountId: number): Promise<AccountTransactionsResponse> => {
    const response = await apiClient.get<AccountTransactionsResponse>(`/transactions/account/${accountId}`);
    return response.data;
  },

  // GET /api/transactions/type/{type} - Get transactions by type
  getByType: async (type: 'income' | 'expense'): Promise<TransactionsByTypeResponse> => {
    const response = await apiClient.get<TransactionsByTypeResponse>(`/transactions/type/${type}`);
    return response.data;
  },
};

export default apiClient;
