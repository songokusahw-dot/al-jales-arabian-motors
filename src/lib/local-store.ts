/** Local-only demo storage. Nothing here is sent to the company or any server. */
export function saveLocal<T>(key: string, entry: T): void {
  if (typeof window === "undefined") return;
  try {
    const list = readLocal<T>(key);
    list.unshift(entry);
    window.localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* storage unavailable — demo only */
  }
}

export function readLocal<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
