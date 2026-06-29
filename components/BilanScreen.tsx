'use client';
import { AppState } from '@/lib/data';
import { ROUTINE_MORNING, ROUTINE_EVENING } from '@/lib/data';
import { requestAndSubscribe } from '@/lib/notifications';
import { showToast } from './Toast';

interface Props { state: AppState; setState: (s: AppState) => void; }

const BADGES = [
  { emoji:'🌅', name:'Lève-tôt', desc:'5 jours de réveil à 5h40', unlocked:true },
  { emoji:'🔥', name:'7 jours streak', desc:'7 jours d\'affilée', unlocked:true },
  { emoji:'💪', name:'Guerrière 30j', desc:'30 jours de sport', unlocked:false },
  { emoji:'📖', name:'Liseuse', desc:'30 jours de lecture', unlocked:false },
  { emoji:'🎨', name:'Artiste', desc:'Peindre ce mois', unlocked:false },
  { emoji:'💧', name:'Hydratée', desc:'7 jours à 1,5L', unlocked:false },
];

export default function BilanScreen({ state, setState }: Props) {
  const morningPct = Math.round(state.morning.filter(Boolean).length / ROUTINE_MORNING.length * 100);
  const eveningPct = Math.round(state.evening.filter(Boolean).length / ROUTINE_EVENING.length * 100);
  const routinePct = Math.round((morningPct + eveningPct) / 2);
  const tasksPct = state.tasks.length ? Math.round(state.tasks.filter(t => t.done).length / state.tasks.length * 100) : 0;
  const sportPct = Math.round(state.sport.filter(Boolean).length / 4 * 100);
  const waterPct = Math.min(100, Math.round(state.water / 1500 * 100));
  const habitsDone = Object.values(state.habits).flat().filter(Boolean).length;
  const habitsPct = Math.round(habitsDone / 21 * 100);
  const score = Math.round((routinePct + tasksPct + sportPct + waterPct + habitsPct) / 5);

  const msgs = [
    'Tu commences — ne lâche pas ! 🌱',
    'Chaque pas compte. Continue ! 💫',
    'Tu progresses vraiment ! 🔥',
    'Incroyable discipline ! ⭐',
    'Tu es une vraie warrior ! 🏆',
  ];
  const msg = msgs[Math.min(4, Math.floor(score / 20))];

  async function enableNotifs() {
    const result = await requestAndSubscribe();
    if (result.ok) {
      setState({ ...state, notifEnabled: true });
      showToast('🔔 Rappels activés ! ' + (result.detail || ''));
    } else {
      showToast('⚠️ ' + (result.detail || 'Erreur inconnue'));
    }
  }

  return (
    <div style={{ paddingBottom:90 }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#6B3FA0,#9B3FC8)', color:'white', padding:'52px 20px 32px', textAlign:'center' }}>
        <div style={{ fontSize:12, opacity:0.8, marginBottom:12 }}>Bilan de la journée</div>
        <div style={{
          width:120, height:120, borderRadius:'50%', margin:'0 auto 12px',
          background:'rgba(255,255,255,0.15)', border:'3px solid rgba(255,255,255,0.5)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        }}>
          <div style={{ fontSize:38, fontWeight:700, fontFamily:'Georgia,serif' }}>{score}</div>
          <div style={{ fontSize:11, opacity:0.8 }}>/ 100</div>
        </div>
        <div style={{ fontSize:15 }}>{msg}</div>
      </div>

      {/* Notifications */}
      {!state.notifEnabled && (
        <Sec title="🔔 Rappels & notifications">
          <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.15)', padding:16, boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>
            <div style={{ fontSize:13, color:'#7B6B8D', marginBottom:14, lineHeight:1.6 }}>
              Active les notifications pour recevoir tes rappels automatiques :<br/>
              <span style={{ color:'#6B3FA0', fontWeight:500 }}>5h40 réveil • 6h05 sport • 7h25 départ • 10h eau • 14h eau • 20h25 cours • 22h lecture</span>
            </div>
            <button onClick={enableNotifs} style={{
              width:'100%', padding:14, background:'#6B3FA0', color:'white',
              border:'none', borderRadius:12, fontSize:15, fontWeight:600, fontFamily:'inherit', cursor:'pointer',
            }}>
              🔔 Activer mes rappels
            </button>
          </div>
        </Sec>
      )}
      {state.notifEnabled && (
        <Sec title="🔔 Notifications">
          <div style={{ background:'#E8F8F2', border:'1px solid rgba(59,170,122,0.3)', borderRadius:12, padding:14, display:'flex', gap:10 }}>
            <span style={{ fontSize:20 }}>✅</span>
            <div style={{ fontSize:13, color:'#1A1025' }}>
              <strong style={{ color:'#3BAA7A', display:'block', marginBottom:2 }}>Rappels activés !</strong>
              Tu recevras tes alertes aux bonnes heures chaque jour.
            </div>
          </div>
        </Sec>
      )}

      {/* Score details */}
      <Sec title="📈 Détail par domaine">
        <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.12)', overflow:'hidden', boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>
          {[
            { label:'🌅 Routine', pct:routinePct },
            { label:'✅ Tâches', pct:tasksPct },
            { label:'💪 Sport', pct:sportPct },
            { label:'💧 Eau', pct:waterPct },
            { label:'🧠 Habitudes', pct:habitsPct },
          ].map((item, i, arr) => (
            <div key={item.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 16px', borderBottom: i<arr.length-1 ? '1px solid rgba(107,63,160,0.08)' : 'none', gap:12 }}>
              <div style={{ fontSize:14, minWidth:120 }}>{item.label}</div>
              <div style={{ flex:1, background:'#F0E8FF', borderRadius:10, height:6 }}>
                <div style={{ height:6, borderRadius:10, background:'#6B3FA0', width:item.pct+'%', transition:'width 0.5s ease' }}/>
              </div>
              <span style={{ fontSize:12, color:'#6B3FA0', fontWeight:600, minWidth:36, textAlign:'right' }}>{item.pct}%</span>
            </div>
          ))}
        </div>
      </Sec>

      {/* Badges */}
      <Sec title="🏅 Badges">
        <div style={{ display:'flex', gap:10, overflowX:'auto', scrollbarWidth:'none', paddingBottom:10 }}>
          {BADGES.map((b, i) => (
            <div key={i} style={{
              flexShrink:0, background:'white', border:'1px solid rgba(107,63,160,0.12)',
              borderRadius:14, padding:14, textAlign:'center', width:100,
              opacity: b.unlocked ? 1 : 0.35, boxShadow:'0 2px 12px rgba(107,63,160,0.08)',
            }}>
              <div style={{ fontSize:28 }}>{b.emoji}</div>
              <div style={{ fontSize:11, fontWeight:600, color:'#6B3FA0', marginTop:6, marginBottom:2 }}>{b.name}</div>
              <div style={{ fontSize:10, color:'#7B6B8D', lineHeight:1.3 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Suggestions */}
      <Sec title="💡 Suggestions pour toi">
        <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.12)', padding:16, boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>
          {[
            { emoji:'🎨', title:'Session peinture du mois', body:'Programme un samedi ou dimanche. Dis-le à Elhadj pour qu\'il sache. C\'est ton moment à toi.' },
            { emoji:'🚶', title:'Sortie mensuelle', body:'Explore un endroit nouveau à Conakry. Ça nourrit l\'âme et casse la routine Netflix.' },
            { emoji:'💻', title:'Certification Full Stack', body:'Tu y es presque. Chaque soir de 20h30 compte. Ne rate aucun cours.' },
            { emoji:'🥗', title:'Alimentation équilibrée', body:'Prépare tes repas à l\'avance le dimanche. Plus simple, moins de fast food, meilleur pour ton ventre.' },
          ].map((s, i, arr) => (
            <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 0', borderBottom: i<arr.length-1 ? '1px solid rgba(107,63,160,0.08)' : 'none' }}>
              <span style={{ fontSize:20, marginTop:2 }}>{s.emoji}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1A1025', marginBottom:2 }}>{s.title}</div>
                <div style={{ fontSize:12, color:'#7B6B8D', lineHeight:1.5 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ padding:'20px 20px 0' }}>
    <div style={{ fontSize:11, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:'#7B6B8D', marginBottom:12 }}>{title}</div>
    {children}
  </div>;
}
