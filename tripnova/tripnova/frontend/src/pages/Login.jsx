import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Compass className="text-primary" size={28} />
          <span className="font-display text-2xl">Trip<span className="text-primary">AI</span></span>
        </div>
        <form onSubmit={submit} className="bg-card/60 rounded-2xl p-6 space-y-4">
          <h1 className="font-display text-xl text-center mb-2">Welcome back</h1>
          {error && <p className="text-secondary text-sm text-center">{error}</p>}
          <input
            type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <input
            type="password" required placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <button className="w-full bg-primary text-ink font-medium rounded-lg py-2.5 text-sm hover:brightness-110">
            Sign in
          </button>
          <p className="text-center text-sm text-slate">
            New here? <Link to="/signup" className="text-primary">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
