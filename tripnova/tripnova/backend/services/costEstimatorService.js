/**
 * Deterministic fallback cost estimator, used when the AI response doesn't
 * include a structured cost block, or to sanity-check/clamp AI-provided figures.
 * Figures are rough per-person, per-day USD baselines by budget tier.
 */
const DAILY_BASELINE_USD = {
  budget:      { accommodation: 35,  food: 20, transport: 10, activities: 15, miscellaneous: 10 },
  'mid-range': { accommodation: 90,  food: 45, transport: 20, activities: 35, miscellaneous: 20 },
  luxury:      { accommodation: 280, food: 110, transport: 60, activities: 90, miscellaneous: 50 },
};

function estimateTripCost({ budgetTier = 'mid-range', days = 1, travelers = 1 }) {
  const baseline = DAILY_BASELINE_USD[budgetTier] || DAILY_BASELINE_USD['mid-range'];
  const breakdown = Object.fromEntries(
    Object.entries(baseline).map(([k, v]) => [k, Math.round(v * days * travelers)])
  );
  breakdown.total = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  breakdown.currency = 'USD';
  return breakdown;
}

module.exports = { estimateTripCost };
