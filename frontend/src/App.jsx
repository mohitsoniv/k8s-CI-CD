import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = '';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/users`, { name, email });
      setUsers([...users, res.data]);
      setName('');
      setEmail('');
      toast.success('User added successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/api/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted');
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const getStatusColor = () => {
    if (users.length === 0) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-2 rounded-full mb-4">
            <span className="text-green-400 text-xl">●</span>
            <span className="text-white/70 text-sm font-mono">System Status: Operational</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">🚀 DevOps Challenge</h1>
          <p className="text-white/60 text-lg">Kubernetes • CI/CD • PostgreSQL</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-white">{users.length}</div>
            <div className="text-white/50 text-sm">Total Users</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className={`text-3xl font-bold ${getStatusColor()}`}>
              {loading ? '⏳' : '✅'}
            </div>
            <div className="text-white/50 text-sm">Database Status</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-white">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="text-white/50 text-sm">Live</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="👤 Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            disabled={submitting}
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:scale-105 transition duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
          >
            {submitting ? '⏳ Adding...' : '➕ Add User'}
          </button>
        </form>

        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">#</th>
                  <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Name</th>
                  <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Email</th>
                  <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Created</th>
                  <th className="text-left px-6 py-4 text-white/50 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-white/40">
                      <div className="animate-pulse">⏳ Loading users...</div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-white/40">
                      <div className="text-4xl mb-2">📭</div>
                      <div>No users yet. Add one above!</div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-white/60 font-mono text-sm">{index + 1}</td>
                      <td className="px-6 py-4 text-white font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-white/70">{user.email}</td>
                      <td className="px-6 py-4 text-white/40 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg text-sm transition"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-white/30 text-sm font-mono">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Connected to PostgreSQL • Deployed on Kubernetes
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;