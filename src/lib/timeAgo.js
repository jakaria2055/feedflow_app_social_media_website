export const timeAgo = (dateString) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diffMs = now - createdAt;

  const seconds = Math.floor(diffMs / 1000); // 1s = 1000ms
  const minutes = Math.floor(seconds / 60); // 1m = 60000ms
  const hours = Math.floor(minutes / 60); // 1s = 1000ms
  const days = Math.floor(hours / 24); // 1s = 1000ms
  const weeks = Math.floor(days / 7); // 1s = 1000ms
  const months = Math.floor(days / 30); // 1s = 1000ms
  const years = Math.floor(days / 365); // 1s = 1000ms

  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};
