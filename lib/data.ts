export const ROUTINE_MORNING = [
  { id: 'm0', time: '05:40', emoji: '🕌', title: 'Réveil & Fajr', sub: 'Ta prière du matin — ton moment sacré', color: '#F0E8FF', notifMsg: 'Il est l\'heure de te lever et de prier ✨' },
  { id: 'm1', time: '06:05', emoji: '🏃', title: 'Sport sur le tapis', sub: '20 min — gainage + cardio léger', color: '#FFF8EC', notifMsg: 'C\'est l\'heure du sport ! 💪 20 minutes pour ton corps' },
  { id: 'm2', time: '06:30', emoji: '🚿', title: 'Douche & soin', sub: 'Prends soin de toi chaque matin', color: '#E6FAF7', notifMsg: 'Douche et prépare-toi, tu es belle 🌸' },
  { id: 'm3', time: '07:00', emoji: '🍳', title: 'Petit-déjeuner', sub: 'Manger = énergie pour toute la journée', color: '#E8F8F2', notifMsg: 'Petit-déjeuner ! Mange bien pour bien travailler 🍳' },
  { id: 'm4', time: '07:30', emoji: '🚪', title: 'Quitter la maison', sub: 'Pour arriver au boulot à 8h00', color: '#FFE8EC', notifMsg: 'Il est 7h30 — temps de partir ! 🏃‍♀️' },
];

export const ROUTINE_EVENING = [
  { id: 'e0', time: '17:00', emoji: '💼', title: 'Fin du boulot', sub: 'Déconnecte-toi du travail', color: '#FFF0F2', notifMsg: 'C\'est l\'heure de rentrer à la maison 🏠' },
  { id: 'e1', time: '18:30', emoji: '🏠', title: 'Retour à la maison', sub: 'Embrasse Elhadj 💑', color: '#F0E8FF', notifMsg: 'Tu es rentrée — moment famille avec Elhadj 💑' },
  { id: 'e2', time: '19:00', emoji: '🍽️', title: 'Préparer le dîner', sub: 'Cuisiner ensemble si possible', color: '#E8F8F2', notifMsg: 'C\'est l\'heure de préparer le dîner 🍽️' },
  { id: 'e3', time: '19:30', emoji: '🧹', title: 'Rangement rapide', sub: '15 min pour un foyer propre', color: '#FFF8EC', notifMsg: 'Petit rangement rapide — 15 min suffit ! 🧹' },
  { id: 'e4', time: '20:30', emoji: '💻', title: 'Cours Full Stack', sub: 'Ta certification — lun. au ven. OBLIGATOIRE', color: '#E6F0FF', notifMsg: '🚨 COURS FULL STACK — commence maintenant ! Ta certif dépend de toi 💻' },
  { id: 'e5', time: '22:00', emoji: '📖', title: 'Lecture (2 pages)', sub: 'Ton cerveau te remerciera demain', color: '#FFF8EC', notifMsg: 'Lis 2 pages avant de dormir 📖 — 5 minutes seulement' },
  { id: 'e6', time: '22:15', emoji: '📵', title: 'Pas d\'écran', sub: 'Prépare-toi pour 5h40 demain', color: '#F0E8FF', notifMsg: 'Pose le téléphone 📵 — dors bien pour te lever à 5h40 🌙' },
];

export const QUOTES = [
  { text: 'La discipline est le pont entre les objectifs et les accomplissements.', author: 'Jim Rohn' },
  { text: 'Ce n\'est pas ce que nous faisons de temps en temps qui nous façonne, mais nos habitudes quotidiennes.', author: 'Tony Robbins' },
  { text: 'Prends soin de ton corps. C\'est le seul endroit où tu vas vivre.', author: 'Jim Rohn' },
  { text: 'Le succès n\'est pas final, l\'échec n\'est pas fatal. C\'est le courage de continuer qui compte.', author: 'Winston Churchill' },
  { text: 'Une femme organisée est une femme puissante.', author: 'Pour Safiatou ✨' },
  { text: 'Chaque matin est une nouvelle chance de devenir la personne que tu veux être.', author: 'Anonyme' },
  { text: 'Ton avenir dépend de ce que tu fais aujourd\'hui.', author: 'Mahatma Gandhi' },
];

export const NOTIFICATIONS_SCHEDULE = [
  { id: 'n_m0', hour: 5, min: 40, title: '🕌 Réveil & Fajr', body: 'Il est l\'heure de te lever et de prier ✨', days: [1,2,3,4,5,6,0] },
  { id: 'n_m1', hour: 6, min: 5,  title: '💪 Sport !', body: '20 minutes sur le tapis — pour toi !', days: [1,2,3,4,5] },
  { id: 'n_m4', hour: 7, min: 25, title: '🚪 Départ dans 5 min !', body: 'Il est presque 7h30 — prépare-toi à partir', days: [1,2,3,4,5] },
  { id: 'n_e4', hour: 20, min: 25, title: '🚨 Cours Full Stack dans 5 min !', body: 'Ta certification t\'attend — ne manque pas ça !', days: [1,2,3,4,5] },
  { id: 'n_water', hour: 10, min: 0, title: '💧 Eau !', body: 'Tu as bu combien ce matin ? Bois un verre maintenant', days: [1,2,3,4,5,6,0] },
  { id: 'n_water2', hour: 14, min: 0, title: '💧 Encore de l\'eau !', body: 'Objectif 1,5 L — tu en es où ?', days: [1,2,3,4,5,6,0] },
  { id: 'n_e5', hour: 22, min: 0, title: '📖 2 pages avant de dormir', body: 'Juste 5 minutes de lecture — tu peux !', days: [1,2,3,4,5,6,0] },
];

export interface Task {
  id: number;
  text: string;
  cat: 'boulot' | 'perso' | 'cert';
  prio: 1 | 2 | 3;
  done: boolean;
  time: string;
  date: string;
}

export interface AppState {
  morning: boolean[];
  evening: boolean[];
  tasks: Task[];
  water: number;
  sport: boolean[];
  habits: { breath: boolean[]; journal: boolean[]; screen: boolean[] };
  taskId: number;
  notifEnabled: boolean;
  lastReset: string;
}

export const DEFAULT_STATE: AppState = {
  morning: new Array(ROUTINE_MORNING.length).fill(false),
  evening: new Array(ROUTINE_EVENING.length).fill(false),
  tasks: [
    { id: 1, text: 'Répondre aux emails clients', cat: 'boulot', prio: 1, done: false, time: '09:00', date: today() },
    { id: 2, text: 'Mettre à jour le site WordPress Suite', cat: 'boulot', prio: 2, done: false, time: '10:30', date: today() },
    { id: 3, text: 'Module 5 — Cours Full Stack ce soir', cat: 'cert', prio: 1, done: false, time: '20:30', date: today() },
    { id: 4, text: 'Ranger le salon', cat: 'perso', prio: 3, done: false, time: '', date: today() },
  ],
  water: 0,
  sport: [false, false, false, false],
  habits: { breath: new Array(7).fill(false), journal: new Array(7).fill(false), screen: new Array(7).fill(false) },
  taskId: 5,
  notifEnabled: false,
  lastReset: today(),
};

export function today(): string {
  return new Date().toISOString().split('T')[0];
}
