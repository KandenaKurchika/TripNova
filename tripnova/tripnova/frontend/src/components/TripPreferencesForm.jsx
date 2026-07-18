import { useState } from 'react';
import { Send } from 'lucide-react';

const BUDGETS = ['budget', 'mid-range', 'luxury'];
const STYLES = ['adventure', 'culture', 'food', 'relaxation', 'nightlife', 'nature'];

export default function TripPreferencesForm({ onSubmit }) {
  const [form, setForm] = useState({
    destination: '', startDate: '', endDate: '', travelers: 2, budgetTier: 'mid-range', interests: [],
  });

  const toggleInterest = (s) =>
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(s) ? f.interests.filter((i) => i !== s) : [...f.interests, s],
    }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
      className="bg-card/60 rounded-2xl p-5 space-y-4"
    >
      <h3 className="font-display text-lg">Plan a new trip</h3>

      <input
        required
        placeholder="Where to? (e.g. Kyoto, Japan)"
        value={form.destination}
        onChange={(e) => setForm({ ...form, destination: e.target.value })}
        className="w-full bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-slate focus:border-amber outline-none"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          type="date" required value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none"
        />
        <input
          type="date" required value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="bg-ink border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-amber outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-slate">Travelers</label>
        <input
          type="number" min={1} value={form.travelers}
          onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })}
          className="w-20 bg-ink border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:border-amber outline-none"
        />
      </div>

      <div>
        <p className="text-sm text-slate mb-2">Budget</p>
        <div className="flex gap-2">
          {BUDGETS.map((b) => (
            <button
              type="button" key={b}
              onClick={() => setForm({ ...form, budgetTier: b })}
              className={`px-3 py-1.5 rounded-full text-xs capitalize border ${
                form.budgetTier === b ? 'bg-primary text-ink border-amber' : 'border-white/10 text-slate'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-slate mb-2">Interests</p>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              type="button" key={s}
              onClick={() => toggleInterest(s)}
              className={`px-3 py-1.5 rounded-full text-xs capitalize border ${
                form.interests.includes(s) ? 'bg-secondary/20 text-secondary border-secondary' : 'border-white/10 text-slate'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-primary text-ink font-medium rounded-lg py-2.5 text-sm hover:brightness-110 transition">
        <Send size={15} /> Generate itinerary
      </button>
    </form>
  );
}
