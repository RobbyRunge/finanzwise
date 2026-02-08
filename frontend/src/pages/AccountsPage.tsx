import { useEffect, useState } from 'react';
import { accountApi, userApi } from '../services/api';
import type { Account, User, CreateAccountRequest } from '../services/api';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreateAccountRequest>({
    userId: 0,
    name: '',
    balance: '0.00',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsData, usersData] = await Promise.all([
        accountApi.getAll(),
        userApi.getAll(),
      ]);
      setAccounts(accountsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await accountApi.create(formData);
      setFormData({ userId: 0, name: '', balance: '0.00' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      await accountApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Accounts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Account'}
        </button>
      </div>

      {/* Create Account Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Create New Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">User</label>
              <select
                required
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Account Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Checking Account"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Initial Balance</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Create Account
            </button>
          </form>
        </div>
      )}

      {/* Accounts Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">User</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Name</th>
              <th className="text-right py-3 px-6 font-semibold text-gray-700">Balance</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Created At</th>
              <th className="text-right py-3 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{account.id}</td>
                <td className="py-3 px-6">{account.userEmail}</td>
                <td className="py-3 px-6">{account.name}</td>
                <td className="py-3 px-6 text-right font-semibold text-green-600">
                  €{parseFloat(account.balance).toFixed(2)}
                </td>
                <td className="py-3 px-6">{account.createdAt}</td>
                <td className="py-3 px-6 text-right">
                  <button
                    onClick={() => handleDelete(account.id)}
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
