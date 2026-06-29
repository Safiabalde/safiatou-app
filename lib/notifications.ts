'use client';
import { NOTIFICATIONS_SCHEDULE } from './data';

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_KEY || '';

export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
    return reg;
  } catch (e) {
    console.error('SW registration failed', e);
    return null;
  }
}

export interface SubscribeResult {
  ok: boolean;
  step: string;
  detail?: string;
}

export async function requestAndSubscribe(): Promise<SubscribeResult> {
  if (!('Notification' in window)) {
    return { ok: false, step: 'unsupported', detail: 'Notification API absente sur ce navigateur.' };
  }
  if (!('serviceWorker' in navigator)) {
    return { ok: false, step: 'unsupported', detail: 'Service Worker non supporté.' };
  }

  let perm: NotificationPermission;
  try {
    perm = await Notification.requestPermission();
  } catch (e) {
    return { ok: false, step: 'permission', detail: String(e) };
  }
  if (perm !== 'granted') {
    return { ok: false, step: 'permission-denied', detail: `Permission: ${perm}` };
  }

  const reg = await registerSW();
  if (!reg) {
    return { ok: false, step: 'sw-register', detail: 'Le service worker n\'a pas pu s\'enregistrer.' };
  }

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS && !isStandalone) {
    return { ok: false, step: 'ios-not-installed', detail: 'Sur iPhone, ouvre l\'app depuis l\'icône installée (pas Safari) pour activer les rappels.' };
  }

  if (!('pushManager' in reg)) {
    scheduleLocalNotifs(reg);
    return { ok: true, step: 'local-only', detail: 'Rappels programmés pour cette session (push serveur non supporté).' };
  }

  if (!VAPID_PUBLIC) {
    scheduleLocalNotifs(reg);
    return { ok: true, step: 'local-only-no-vapid', detail: 'Rappels programmés localement (clé VAPID absente).' };
  }

  try {
    const existing = await reg.pushManager.getSubscription();
    if (existing) await existing.unsubscribe();

    await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC) as unknown as ArrayBuffer,
    });
  } catch (e) {
    scheduleLocalNotifs(reg);
    return { ok: true, step: 'local-fallback', detail: `Push serveur indisponible (${String(e)}), rappels locaux activés.` };
  }

  scheduleLocalNotifs(reg);
  return { ok: true, step: 'full' };
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