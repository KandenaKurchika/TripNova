import { Clock, Utensils, Landmark, Car, Bed, ShoppingBag, Sparkles } from 'lucide-react';

const ICONS = {
  sightseeing: Landmark,
  food: Utensils,
  transport: Car,
  accommodation: Bed,
  shopping: ShoppingBag,
  leisure: Sparkles,
  other: Sparkles,
};

export default function ItineraryTimeline({ days = [] }) {
  if (!days.length) return null;

  return (
    <div className="space-y-6">
      {days.map((day, i) => (
        <div key={day.day ?? i} className={i > 0 ? 'flight-path pt-6' : ''}>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-primary text-xs">DAY {day.day}</span>
            <h4 className="font-display text-lg">{day.theme}</h4>
          </div>
          <ul className="space-y-2">
            {(day.activities || []).map((act, j) => {
              const Icon = ICONS[act.category] || Sparkles;
              return (
                <li key={j} className="flex items-start gap-3 bg-card/50 rounded-xl px-3 py-2.5">
                  <Icon size={16} className="text-secondary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate mb-0.5">
                      <Clock size={12} /> {act.time}
                    </div>
                    <p className="text-sm">{act.title}</p>
                  </div>
                  {!!act.estimatedCost && (
                    <span className="font-mono text-xs text-primary shrink-0">${act.estimatedCost}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
