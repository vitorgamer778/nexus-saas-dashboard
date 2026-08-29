export function customerHealthScore(input: {
  status: string;
  mrr: number;
  lastActivityAt: string | null;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  let score =
    input.status === "Active" ? 50 : input.status === "Trial" ? 35 : 5;
  if (input.mrr > 0) score += 20;
  if (input.lastActivityAt) {
    const days =
      (now.getTime() - new Date(input.lastActivityAt).getTime()) / 86_400_000;
    score += days <= 7 ? 30 : days <= 30 ? 15 : 0;
  }
  return Math.max(0, Math.min(100, score));
}

export function healthLabel(score: number) {
  return score >= 75 ? "Healthy" : score >= 50 ? "Watch" : "At risk";
}
