'use client';
import { AppState, DEFAULT_STATE, today } from './data';

const KEY = 'safiatou-v2';

export function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const s: AppState = JSON.parse(raw);
    // Reset daily if new day
    if (s.lastReset !== today()) {
      s.morning = new Array(s.morning.length).fill(false);
      s.evening = new Array(s.evening.length).fill(false);
      s.water = 0;
      s.sport = [false, false, false, false];
      s.lastReset = today();
      saveState(s);
    }
    return s;
  } catch { return { ...DEFAULT_STATE }; }
}

export function saveState(s: AppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(s));
}
