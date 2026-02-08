import { useEffect, useState } from 'react';
import { transactionApi, accountApi } from '../services/api';
import type { Transaction, Account, CreateTransactionRequest } from '../services/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateTransactionRequest>({
    accountId: 0,
    amount: '',
    type: 'income',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsData, accountsData] = await Promise.all([
        transactionApi.getAll(),
        accountApi.getAll(),
      ]);
      setTransactions(transactionsData);
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionApi.create(formData);
      setFormData({
        accountId: 0,
        amount: '',
        type: 'income',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Error creating transaction');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await transactionApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Transactions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <h3 className="text-green-700 text-sm font-medium">Total Income</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            €{totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h3 className="text-red-700 text-sm font-medium">Total Expense</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">
            €{totalExpense.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h3 className="text-blue-700 text-sm font-medium">Net Balance</h3>
          <p className={`text-3xl font-bold mt-2 ${
            totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            €{(totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Create Transaction Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Create New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Account</label>
                <select
                  required
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.userEmail})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Type</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Salary, Groceries"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Create Transaction
            </button>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Account</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Description</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Type</th>
              <th className="text-right py-3 px-6 font-semibold text-gray-700">Amount</th>
              <th className="text-right py-3 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{transaction.date}</td>
                <td className="py-3 px-6">{transaction.accountName}</td>
                <td className="py-3 px-6">{transaction.category || '-'}</td>
                <td className="py-3 px-6">{transaction.description || '-'}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="py-3 px-6 text-right font-semibold">
                  €{parseFloat(transaction.amount).toFixed(2)}
                </td>
                <td className="py-3 px-6 text-right">
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
