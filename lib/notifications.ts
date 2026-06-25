'use client';
import { NOTIFICATIONS_SCHEDULE } from './data';

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_KEY!;

export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  const reg = await navigator.serviceWorker.register('/sw.js');
  return reg;
}

export async function requestAndSubscribe(): Promise<boolean> {
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return false;
    const reg = await registerSW();
    if (!reg) return false;
    // Subscribe to push
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC) as unknown as ArrayBuffer,
    });
    await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) });
    // Schedule local notifications via alarms (using setTimeout for current session)
    scheduleLocalNotifs(reg);
    return true;
  } catch (e) { console.error(e); return false; }
}

export function scheduleLocalNotifs(reg: ServiceWorkerRegistration) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  NOTIFICATIONS_SCHEDULE.forEach(n => {
    if (!n.days.includes(dayOfWeek)) return;
    const target = new Date();
    target.setHours(n.hour, n.min, 0, 0);
    const diff = target.getTime() - now.getTime();
    if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
      setTimeout(() => {
        reg.showNotification(n.title, {
          body: n.body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          // vibrate: [300, 100, 300],
          tag: n.id,
        });
      }, diff);
    }
  });
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
