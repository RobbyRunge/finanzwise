import { useEffect, useState } from 'react';
import { userApi, accountApi, transactionApi } from '../services/api';
import type { User, Account, Transaction } from '../services/api';

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, accountsData, transactionsData] = await Promise.all([
          userApi.getAll(),
          accountApi.getAll(),
          transactionApi.getAll(),
        ]);
        setUsers(usersData);
        setAccounts(accountsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => {
    return sum + parseFloat(account.balance || '0');
  }, 0);

  // Calculate income and expense
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">FinanzWise Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Accounts</h3>
          <p className="text-3xl font-bold mt-2">{accounts.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            €{totalBalance.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Transactions</h3>
          <p className="text-3xl font-bold mt-2">{transactions.length}</p>
        </div>
      </div>

      {/* Income vs Expense */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <h3 className="text-green-700 text-lg font-semibold">Total Income</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            €{totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h3 className="text-red-700 text-lg font-semibold">Total Expense</h3>
          <p className="text-3xl font-bold mt-2 text-red-600">
            €{totalExpense.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Date</th>
                  <th className="text-left py-2 px-4">Account</th>
                  <th className="text-left py-2 px-4">Category</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-right py-2 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{transaction.date}</td>
                    <td className="py-2 px-4">{transaction.accountName}</td>
                    <td className="py-2 px-4">{transaction.category || '-'}</td>
                    <td className="py-2 px-4">
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
                    <td className="py-2 px-4 text-right font-semibold">
                      €{parseFloat(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
