const SETTINGS_KEY = "aceit:settings";
const HISTORY_KEY = "aceit:history";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep working in memory */
  }
}

export const loadSettings = () => {
  const s = read(SETTINGS_KEY, {});
  return { apiKey: typeof s.apiKey === "string" ? s.apiKey : "", model: typeof s.model === "string" ? s.model : "" };
};
export const saveSettings = (settings) => write(SETTINGS_KEY, settings);

export const loadHistory = () => {
  const h = read(HISTORY_KEY, []);
  return Array.isArray(h) ? h : [];
};

export function addHistory(entry) {
  const next = [...loadHistory(), entry].slice(-30);
  write(HISTORY_KEY, next);
  return next;
}

export function historyStats(history) {
  if (!history.length) return { sessions: 0, best: 0 };
  return { sessions: history.length, best: Math.max(...history.map((h) => h.avg)) };
}
