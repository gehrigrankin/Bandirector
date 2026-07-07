/** Two-letter uppercase initials from a display name or email address. */
export function getInitials(source?: string | null): string {
  if (!source) return "··";
  const name = source.includes("@") ? source.split("@")[0] : source;
  const parts = name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
