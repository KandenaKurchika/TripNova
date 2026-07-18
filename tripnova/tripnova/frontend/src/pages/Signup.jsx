import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
          <h1 className="font-display text-xl text-center mb-2">Create your account</h1>
          {error && <p className="text-secondary text-sm text-center">{error}</p>}
          <input
            required placeholder="Full name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <input
            type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <input
            type="password" required placeholder="Password (min 8 characters)" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber"
          />
          <button className="w-full bg-primary text-ink font-medium rounded-lg py-2.5 text-sm hover:brightness-110">
            Create account
          </button>
          <p className="text-center text-sm text-slate">
            Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
