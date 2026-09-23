export function formatPoints(value: number): string {
  const points = Number(value) || 0;
  if (points < 1000) return points.toLocaleString();
  if (points < 1000000) {
    return `${(points / 1000).toFixed(points >= 10000 ? 0 : 1).replace(/\.0$/, '')}K`;
  }
  return `${(points / 1000000).toFixed(points >= 10000000 ? 0 : 1).replace(/\.0$/, '')}M`;
}
