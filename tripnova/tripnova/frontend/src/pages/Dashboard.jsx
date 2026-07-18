import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Users } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import api from '../api/axiosClient.js';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trips').then(({ data }) => setTrips(data.trips)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-2xl">My Trips</h1>
            <Link to="/plan" className="flex items-center gap-2 bg-primary text-ink text-sm font-medium px-4 py-2 rounded-lg hover:brightness-110">
              <Plus size={16} /> New itinerary
            </Link>
          </div>

          {loading && <p className="text-slate text-sm">Loading trips…</p>}

          {!loading && !trips.length && (
            <div className="bg-card/50 rounded-2xl p-10 text-center text-slate">
              No trips yet. Start a conversation with TripNova to plan your first one.
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((t) => (
              <Link
                key={t._id}
                to={`/plan/${t._id}`}
                className="bg-card/50 hover:bg-card/80 transition rounded-2xl p-5 block"
              >
                <h3 className="font-display text-lg mb-2">{t.title}</h3>
                <div className="space-y-1 text-sm text-slate">
                  <p className="flex items-center gap-2"><MapPin size={14} /> {t.destination?.city}</p>
                  <p className="flex items-center gap-2">
                    <Calendar size={14} /> {new Date(t.startDate).toLocaleDateString()} – {new Date(t.endDate).toLocaleDateString()}
                  </p>
                  <p className="flex items-center gap-2"><Users size={14} /> {t.travelers} traveler(s)</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-secondary">{t.status}</span>
                  <span className="font-mono text-primary text-sm">${t.estimatedCost?.total || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
