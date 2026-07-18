import { CloudSun, ShieldAlert, DollarSign } from 'lucide-react';

export default function WeatherSafetyCard({ forecast = [], safetyNotes = [], costEstimate }) {
  return (
    <div className="space-y-4">
      {!!forecast.length && (
        <div className="bg-card/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate mb-3">
            <CloudSun size={14} className="text-primary" /> Weather outlook
          </div>
          <div className="flex gap-3 overflow-x-auto">
            {forecast.slice(0, 5).map((d) => (
              <div key={d.date} className="shrink-0 text-center bg-card/50 rounded-lg px-3 py-2 min-w-[70px]">
                <p className="text-[11px] text-slate">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                <p className="text-sm font-mono mt-1">{Math.round(d.tempHighC)}°/{Math.round(d.tempLowC)}°</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!!safetyNotes.length && (
        <div className="bg-card/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate mb-3">
            <ShieldAlert size={14} className="text-secondary" /> Safety notes
          </div>
          <ul className="space-y-1.5 text-sm">
            {safetyNotes.map((n, i) => <li key={i} className="text-white/90">• {n}</li>)}
          </ul>
        </div>
      )}

      {costEstimate && (
        <div className="bg-card/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate mb-3">
            <DollarSign size={14} className="text-primary" /> Estimated cost
          </div>
          <div className="space-y-1 text-sm">
            {Object.entries(costEstimate)
              .filter(([k]) => !['total', 'currency'].includes(k))
              .map(([k, v]) => (
                <div key={k} className="flex justify-between text-white/80">
                  <span className="capitalize">{k}</span>
                  <span className="font-mono">${v}</span>
                </div>
              ))}
            <div className="flex justify-between pt-2 mt-2 border-t border-white/10 font-medium">
              <span>Total</span>
              <span className="font-mono text-primary">${costEstimate.total} {costEstimate.currency}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
