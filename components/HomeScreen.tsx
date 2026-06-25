'use client';
import { AppState } from '@/lib/data';
import { ROUTINE_MORNING, ROUTINE_EVENING, QUOTES } from '@/lib/data';
import { showToast } from './Toast';

interface Props {
  state: AppState;
  setState: (s: AppState) => void;
}

export default function HomeScreen({ state, setState }: Props) {
  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Bonjour ✨' : h < 18 ? 'Bon après-midi ☀️' : 'Bonsoir 🌙';

  const d = new Date();
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const dateStr = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

  const totalBlocks = ROUTINE_MORNING.length + ROUTINE_EVENING.length;
  const doneBlocks = state.morning.filter(Boolean).length + state.evening.filter(Boolean).length;
  const pct = totalBlocks > 0 ? doneBlocks / totalBlocks : 0;
  const circ = 163;
  const offset = circ - circ * pct;

  const waterPct = Math.min(100, Math.round(state.water / 1500 * 100));

  function toggleBlock(type: 'morning' | 'evening', i: number) {
    const arr = [...state[type]];
    arr[i] = !arr[i];
    const updated = { ...state, [type]: arr };
    setState(updated);
    const block = type === 'morning' ? ROUTINE_MORNING[i] : ROUTINE_EVENING[i];
    if (arr[i]) showToast('✅ ' + block.title + ' — fait !');
  }

  function addWater(ml: number) {
    const w = Math.max(0, state.water + ml);
    setState({ ...state, water: w });
    if (ml > 0) showToast('💧 +' + ml + ' ml bu !');
  }

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6B3FA0 0%, #9B3FC8 100%)',
        color: 'white', padding: '52px 20px 24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
        <div style={{ fontSize:13, opacity:0.8, marginBottom:4 }}>{greeting}</div>
        <div style={{ fontSize:26, fontFamily:'Georgia,serif', marginBottom:2 }}>Safiatou</div>
        <div style={{ fontSize:12, opacity:0.7 }}>Tu es capable de tout ce que tu décides.</div>
        
        <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, opacity:0.75, background:'rgba(255,255,255,0.15)', display:'inline-block', padding:'4px 12px', borderRadius:20 }}>{dateStr}</div>
            <div style={{ marginTop:10, background:'rgba(255,255,255,0.15)', borderRadius:20, height:8, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'rgba(255,255,255,0.85)', borderRadius:20, width:waterPct+'%', transition:'width 0.5s ease' }}/>
            </div>
            <div style={{ fontSize:11, opacity:0.8, marginTop:5 }}>💧 {(state.water/1000).toFixed(2).replace('.',',')} / 1,5 L</div>
          </div>
          {/* Progress ring */}
          <div style={{ textAlign:'center' }}>
            <svg width={64} height={64} style={{ transform:'rotate(-90deg)' }}>
              <circle cx={32} cy={32} r={26} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={5}/>
              <circle cx={32} cy={32} r={26} fill="none" stroke="white" strokeWidth={5}
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition:'stroke-dashoffset 0.5s ease' }}/>
            </svg>
            <div style={{ fontSize:11, opacity:0.8, marginTop:-48, paddingBottom:36, textAlign:'center', color:'white' }}>
              <span style={{ fontSize:20, fontWeight:700 }}>{doneBlocks}</span>
              <div style={{ fontSize:9 }}>faits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div style={{ padding:'20px 20px 0' }}>
        <div style={{ background:'linear-gradient(135deg,#6B3FA0,#9B3FC8)', color:'white', borderRadius:16, padding:20, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:8, right:16, fontSize:60, opacity:0.15, fontFamily:'serif' }}>❝</div>
          <div style={{ fontFamily:'Georgia,serif', fontSize:15, fontStyle:'italic', lineHeight:1.5 }}>{quote.text}</div>
          <div style={{ fontSize:11, opacity:0.7, marginTop:10 }}>— {quote.author}</div>
        </div>
      </div>

      {/* Morning routine */}
      <Section title="🌅 Routine du matin">
        <Card>
          {ROUTINE_MORNING.map((b, i) => (
            <RoutineBlock key={b.id} block={b} done={state.morning[i]} onClick={() => toggleBlock('morning', i)} />
          ))}
        </Card>
      </Section>

      {/* Evening routine */}
      <Section title="🌙 Soirée & maison">
        <Card>
          {ROUTINE_EVENING.map((b, i) => (
            <RoutineBlock key={b.id} block={b} done={state.evening[i]} onClick={() => toggleBlock('evening', i)} />
          ))}
        </Card>
      </Section>

      {/* Water */}
      <Section title="💧 Eau du jour">
        <Card>
          <div style={{ display:'flex', gap:8, padding:'14px 16px', flexWrap:'wrap' }}>
            {[250,330,500].map(ml => (
              <button key={ml} onClick={() => addWater(ml)} style={waterBtnStyle}>{`+${ml} ml`}</button>
            ))}
            <button onClick={() => addWater(-250)} style={{ ...waterBtnStyle, color:'#7B6B8D' }}>−250 ml</button>
          </div>
          <div style={{ padding:'0 16px 14px', fontSize:13, color:'#7B6B8D' }}>
            Objectif : 1 500 ml par jour 🎯 — tu es à {waterPct}%
          </div>
        </Card>
      </Section>

      {/* Tips */}
      <Section title="✨ Pour toi">
        <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:10, scrollbarWidth:'none' }}>
          {TIPS.map((t, i) => (
            <div key={i} style={{ flexShrink:0, background:'white', border:'1px solid rgba(107,63,160,0.12)', borderRadius:10, padding:'12px 14px', width:170 }}>
              <div style={{ fontSize:20, marginBottom:6 }}>{t.emoji}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'#6B3FA0', marginBottom:4 }}>{t.title}</div>
              <div style={{ fontSize:11, color:'#7B6B8D', lineHeight:1.4 }}>{t.body}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function RoutineBlock({ block, done, onClick }: { block: typeof ROUTINE_MORNING[0]; done: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
      cursor:'pointer', borderBottom:'1px solid rgba(107,63,160,0.08)',
      opacity: done ? 0.55 : 1, transition:'all 0.2s',
    }}>
      <div style={{ fontSize:11, fontWeight:600, color:'#7B6B8D', minWidth:42 }}>{block.time}</div>
      <div style={{ width:36, height:36, borderRadius:10, background:block.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{block.emoji}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:500, textDecoration: done ? 'line-through' : 'none', color:'#1A1025' }}>{block.title}</div>
        <div style={{ fontSize:12, color:'#7B6B8D', marginTop:1 }}>{block.sub}</div>
      </div>
      <div style={{
        width:24, height:24, borderRadius:'50%',
        border: done ? 'none' : '2px solid #D4C5E8',
        background: done ? '#6B3FA0' : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink:0, transition:'all 0.2s',
      }}>
        {done && <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2}><polyline points="2,6 5,9 10,3"/></svg>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div style={{ padding:'20px 20px 0' }}><div style={{ fontSize:11, fontWeight:600, letterSpacing:1.2, textTransform:'uppercase', color:'#7B6B8D', marginBottom:12 }}>{title}</div>{children}</div>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.12)', overflow:'hidden', boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>{children}</div>;
}

const waterBtnStyle: React.CSSProperties = {
  flex:1, minWidth:60, padding:'10px 6px', border:'1px solid rgba(107,63,160,0.12)',
  borderRadius:8, background:'#FAF8FF', cursor:'pointer', fontSize:12,
  fontFamily:'inherit', textAlign:'center', color:'#1A1025',
};

const TIPS = [
  { emoji:'🎨', title:'Peinture ce mois', body:'Planifie ta session créative — 1x/mois c\'est ton droit.' },
  { emoji:'📖', title:'2 pages ce soir', body:'5 minutes de lecture avant de dormir change tout.' },
  { emoji:'🥗', title:'Ventre plat', body:'Moins de sucre + gainage 10 min = résultats en 3 semaines.' },
  { emoji:'💻', title:'Full Stack', body:'Ton cours du soir, c\'est ton avenir. Ne le laisse jamais.' },
  { emoji:'💑', title:'Elhadj', body:'10 min ensemble sans téléphone = connexion qui dure.' },
];
