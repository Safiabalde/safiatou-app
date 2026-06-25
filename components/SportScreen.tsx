'use client';
import { AppState } from '@/lib/data';
import { showToast } from './Toast';

interface Props { state: AppState; setState: (s: AppState) => void; }

const SPORTS = [
  { emoji:'🧘', name:'Gainage', dur:'5 min' },
  { emoji:'🏃', name:'Cardio tapis', dur:'15 min' },
  { emoji:'💪', name:'Abdos / crunchs', dur:'10 min' },
  { emoji:'🤸', name:'Étirements', dur:'5 min' },
];

const DAYS = ['L','M','M','J','V','S','D'];

const VENTRE_PLAT = [
  { sem:'Semaine 1', ex:'Gainage basique', sets:'3 × 30s' },
  { sem:'Semaine 2', ex:'Crunchs + gainage', sets:'3 × 45s' },
  { sem:'Semaine 3', ex:'Mountain climbers', sets:'3 × 1min' },
  { sem:'Semaine 4', ex:'Circuit complet', sets:'4 × 1min' },
];

export default function SportScreen({ state, setState }: Props) {
  const doneSport = state.sport.filter(Boolean).length;

  function toggleSport(i: number) {
    const sport = [...state.sport];
    sport[i] = !sport[i];
    setState({ ...state, sport });
    if (sport[i]) showToast('💪 Super, continue comme ça !');
  }

  function toggleHabit(h: 'breath'|'journal'|'screen', i: number) {
    const habits = { ...state.habits, [h]: [...state.habits[h]] };
    habits[h][i] = !habits[h][i];
    setState({ ...state, habits });
  }

  return (
    <div style={{ paddingBottom:90 }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#F5A623,#d4891a)', color:'white', padding:'52px 20px 24px' }}>
        <div style={{ fontSize:12, opacity:0.8, marginBottom:4 }}>Sport & bien-être</div>
        <div style={{ fontSize:24, fontFamily:'Georgia,serif', marginBottom:6 }}>Corps fort, esprit fort</div>
        <div style={{ fontSize:12, opacity:0.8 }}>20 min le matin sur le tapis = transformation</div>
        <div style={{ display:'flex', gap:12, marginTop:14 }}>
          <StatBox num={doneSport} label="séances" />
          <StatBox num={doneSport * 20} label="minutes" />
          <StatBox num={Math.round(doneSport/4*100)} label="% objectif" />
        </div>
      </div>

      {/* Séances */}
      <Sec title="🏋️ Séances du matin (coche ce que tu fais)">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {SPORTS.map((s, i) => (
            <div key={i} onClick={() => toggleSport(i)} style={{
              background: state.sport[i] ? '#6B3FA0' : 'white',
              border: `1px solid ${state.sport[i] ? '#6B3FA0' : 'rgba(107,63,160,0.12)'}`,
              borderRadius:12, padding:16, textAlign:'center', cursor:'pointer',
              transition:'all 0.2s', boxShadow:'0 2px 12px rgba(107,63,160,0.08)',
            }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{s.emoji}</div>
              <div style={{ fontSize:13, fontWeight:500, color: state.sport[i] ? 'white' : '#1A1025' }}>{s.name}</div>
              <div style={{ fontSize:11, color: state.sport[i] ? 'rgba(255,255,255,0.75)' : '#7B6B8D', marginTop:2 }}>{s.dur}</div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Ventre plat */}
      <Sec title="🔥 Défi ventre plat — 30 jours">
        <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.12)', padding:16, boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>
          <div style={{ fontSize:13, color:'#7B6B8D', marginBottom:12 }}>Programme progressif — après la prière du matin</div>
          {VENTRE_PLAT.map((v, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i<3 ? '1px solid rgba(107,63,160,0.08)' : 'none' }}>
              <div>
                <div style={{ fontSize:12, color:'#9B6DD6', fontWeight:600, marginBottom:2 }}>{v.sem}</div>
                <div style={{ fontSize:13, color:'#1A1025' }}>{v.ex}</div>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:'#6B3FA0', background:'#F0E8FF', padding:'4px 10px', borderRadius:20 }}>{v.sets}</span>
            </div>
          ))}
          <div style={{ marginTop:14, background:'#FFF8EC', borderRadius:8, padding:12, fontSize:12, color:'#7B6B8D', lineHeight:1.5 }}>
            💡 <strong>Alimentation :</strong> réduis le pain blanc, le sucre et les boissons sucrées. Ajoute des légumes à chaque repas. Résultats visibles en 3–4 semaines avec la constance.
          </div>
        </div>
      </Sec>

      {/* Mental */}
      <Sec title="🧠 Habitudes mentales">
        <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.12)', overflow:'hidden', boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>
          {[
            { key:'breath' as const, emoji:'🌬️', name:'Respiration 4-7-8', sub:'3 min le matin — calme l\'anxiété' },
            { key:'journal' as const, emoji:'📓', name:'3 gratitudes le soir', sub:'Avant de dormir — ancre le positif' },
            { key:'screen' as const, emoji:'📵', name:'Pas d\'écran après 22h', sub:'Pour te lever à 5h40 sans souffrir' },
          ].map((h, hi) => (
            <div key={h.key} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderBottom: hi<2 ? '1px solid rgba(107,63,160,0.08)' : 'none' }}>
              <span style={{ fontSize:22, width:32, textAlign:'center' }}>{h.emoji}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500, color:'#1A1025' }}>{h.name}</div>
                <div style={{ fontSize:11, color:'#7B6B8D' }}>{h.sub}</div>
              </div>
              <div style={{ display:'flex', gap:4 }}>
                {DAYS.map((day, di) => (
                  <div key={di} onClick={() => toggleHabit(h.key, di)} style={{
                    width:22, height:22, borderRadius:5, cursor:'pointer',
                    background: state.habits[h.key][di] ? '#6B3FA0' : 'rgba(107,63,160,0.1)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:9, color: state.habits[h.key][di] ? 'white' : '#9B6DD6',
                    fontWeight:600, transition:'all 0.2s',
                  }}>{day}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* Lecture */}
      <Sec title="📖 Lecture quotidienne">
        <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.12)', padding:16, boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>
          <div style={{ fontSize:13, color:'#7B6B8D', lineHeight:1.6 }}>
            Objectif : <strong style={{ color:'#6B3FA0' }}>2 pages minimum</strong> par soir avant de dormir.<br/>
            5 minutes suffisent. En un mois, c'est un livre entier.
          </div>
          <div style={{ display:'flex', gap:4, marginTop:12, flexWrap:'wrap' }}>
            {DAYS.map((day, di) => (
              <div key={di} onClick={() => toggleHabit('journal', di)} style={{
                width:36, height:36, borderRadius:8, cursor:'pointer', textAlign:'center', lineHeight:'36px',
                background: state.habits.journal[di] ? '#E8F8F2' : '#FAF8FF',
                border: `1px solid ${state.habits.journal[di] ? '#3BAA7A' : 'rgba(107,63,160,0.12)'}`,
                color: state.habits.journal[di] ? '#3BAA7A' : '#7B6B8D',
                fontSize:12, fontWeight:600, transition:'all 0.2s',
              }}>{day}</div>
            ))}
          </div>
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
function StatBox({ num, label }: { num: number; label: string }) {
  return <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 14px', textAlign:'center' }}>
    <div style={{ fontSize:20, fontWeight:700 }}>{num}</div>
    <div style={{ fontSize:10, opacity:0.8 }}>{label}</div>
  </div>;
}
