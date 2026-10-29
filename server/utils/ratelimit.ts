const hits = new Map<string, number[]>()
let lastSweep = 0

export function tooManyRequests(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()

  if (now - lastSweep > windowMs) {
    for (const [k, times] of hits) {
      const kept = times.filter(t => now - t < windowMs)
      if (kept.length) hits.set(k, kept)
      else hits.delete(k)
    }
    lastSweep = now
  }

  const recent = (hits.get(key) || []).filter(t => now - t < windowMs)
  if (recent.length >= limit) {
    hits.set(key, recent)
    return true
  }

  recent.push(now)
  hits.set(key, recent)
  return false
}
