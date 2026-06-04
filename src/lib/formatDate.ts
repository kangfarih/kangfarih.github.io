export function formatDate(date?: string) {
  if (!date) return "";
  const t = Date.parse(date);
  if (!Number.isFinite(t)) return date;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(t));
}

