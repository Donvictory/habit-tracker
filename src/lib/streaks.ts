export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  if (completions.length === 0) return 0;

  const sortedDates = Array.from(new Set(completions)).sort((a, b) =>
    b.localeCompare(a),
  );

  const todayStr = today || new Date().toISOString().split("T")[0];

  if (!sortedDates.includes(todayStr)) return 0;

  let streak = 0;

  let currentDate = new Date(todayStr + "T12:00:00");

  while (true) {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    const d = String(currentDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    if (sortedDates.includes(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
