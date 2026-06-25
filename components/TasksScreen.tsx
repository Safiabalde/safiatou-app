'use client';
import { useState } from 'react';
import { AppState, Task, today } from '@/lib/data';
import { showToast } from './Toast';

interface Props { state: AppState; setState: (s: AppState) => void; }

const CATS = { boulot:'💼 Boulot', perso:'🏠 Perso', cert:'💻 Certif' };
const PRIO_COLORS = { 1:{ bg:'#FFE8EC', color:'#E8637A' }, 2:{ bg:'#FFF8EC', color:'#F5A623' }, 3:{ bg:'#E6FAF7', color:'#2BBFA4' } };

export default function TasksScreen({ state, setState }: Props) {
  const [filter, setFilter] = useState<'all'|'boulot'|'perso'|'cert'>('all');
  const [text, setText] = useState('');
  const [cat, setCat] = useState<'boulot'|'perso'|'cert'>('boulot');
  const [prio, setPrio] = useState<1|2|3>(1);
  const [time, setTime] = useState('');

  const filtered = state.tasks.filter(t => filter === 'all' || t.cat === filter);
  const pending = state.tasks.filter(t => !t.done).length;

  function toggle(id: number) {
    const tasks = state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setState({ ...state, tasks });
    const t = tasks.find(x => x.id === id);
    if (t?.done) showToast('✅ Tâche accomplie !');
  }

  function addTask() {
    if (!text.trim()) return;
    const task: Task = { id: state.taskId, text: text.trim(), cat, prio, done: false, time, date: today() };
    setState({ ...state, tasks: [...state.tasks, task], taskId: state.taskId + 1 });
    setText(''); setTime('');
    showToast('✅ Tâche ajoutée !');
  }

  function deleteTask(id: number) {
    setState({ ...state, tasks: state.tasks.filter(t => t.id !== id) });
    showToast('🗑️ Tâche supprimée');
  }

  return (
    <div style={{ paddingBottom:90 }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#E8637A,#c94b60)', color:'white', padding:'52px 20px 24px' }}>
        <div style={{ fontSize:12, opacity:0.8, marginBottom:4 }}>Mes tâches</div>
        <div style={{ fontSize:24, fontFamily:'Georgia,serif', marginBottom:6 }}>Ce que je dois faire</div>
        <div style={{ display:'flex', gap:12, marginTop:8 }}>
          <Stat num={state.tasks.length} label="total" />
          <Stat num={pending} label="à faire" />
          <Stat num={state.tasks.length - pending} label="faites" />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, overflowX:'auto', padding:'16px 20px 8px', scrollbarWidth:'none' }}>
        {(['all','boulot','perso','cert'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            flexShrink:0, padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:500,
            cursor:'pointer', border:'1px solid rgba(107,63,160,0.15)', fontFamily:'inherit',
            background: filter===f ? '#6B3FA0' : 'white',
            color: filter===f ? 'white' : '#7B6B8D',
          }}>
            {f === 'all' ? 'Toutes' : CATS[f]}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ margin:'0 20px', background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.12)', overflow:'hidden', boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>
        {filtered.length === 0
          ? <div style={{ padding:24, textAlign:'center', color:'#7B6B8D', fontSize:14 }}>Aucune tâche ici 🎉</div>
          : filtered.sort((a,b) => a.prio - b.prio).map((t, i) => (
            <div key={t.id} style={{
              display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
              borderBottom: i < filtered.length-1 ? '1px solid rgba(107,63,160,0.08)' : 'none',
              opacity: t.done ? 0.6 : 1,
            }}>
              <div onClick={() => toggle(t.id)} style={{
                width:22, height:22, borderRadius:6, flexShrink:0, cursor:'pointer',
                border: t.done ? 'none' : '2px solid #D4C5E8',
                background: t.done ? '#6B3FA0' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.2s',
              }}>
                {t.done && <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2}><polyline points="2,6 5,9 10,3"/></svg>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, textDecoration: t.done ? 'line-through' : 'none', color:'#1A1025' }}>{t.text}</div>
                <div style={{ display:'flex', gap:6, marginTop:3, alignItems:'center' }}>
                  {t.time && <span style={{ fontSize:11, color:'#7B6B8D' }}>⏰ {t.time}</span>}
                  <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, ...PRIO_COLORS[t.prio] }}>P{t.prio}</span>
                  <span style={{ fontSize:10, color:'#B8A8CC' }}>{CATS[t.cat]}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(t.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#D4C5E8', padding:4 }}>×</button>
            </div>
          ))
        }
      </div>

      {/* Add task */}
      <div style={{ margin:'12px 20px', background:'white', borderRadius:16, border:'1px solid rgba(107,63,160,0.12)', padding:16, boxShadow:'0 2px 20px rgba(107,63,160,0.08)' }}>
        <div style={{ fontSize:12, fontWeight:600, color:'#7B6B8D', marginBottom:10, letterSpacing:1 }}>NOUVELLE TÂCHE</div>
        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key==='Enter' && addTask()}
          placeholder="Description de la tâche..."
          style={{ width:'100%', border:'1px solid rgba(107,63,160,0.15)', borderRadius:8, padding:'10px 12px', fontSize:14, fontFamily:'inherit', marginBottom:10, color:'#1A1025', background:'#FAF8FF', outline:'none' }}/>
        <div style={{ display:'flex', gap:8, marginBottom:10 }}>
          <select value={cat} onChange={e => setCat(e.target.value as never)} style={selectStyle}>
            <option value="boulot">💼 Boulot</option>
            <option value="perso">🏠 Perso</option>
            <option value="cert">💻 Certif</option>
          </select>
          <select value={prio} onChange={e => setPrio(Number(e.target.value) as never)} style={selectStyle}>
            <option value={1}>🔴 Priorité 1</option>
            <option value={2}>🟡 Priorité 2</option>
            <option value={3}>🟢 Priorité 3</option>
          </select>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ ...selectStyle, flex:1 }}/>
        </div>
        <button onClick={addTask} style={{
          width:'100%', padding:12, background:'#6B3FA0', color:'white',
          border:'none', borderRadius:10, fontSize:14, fontWeight:600, fontFamily:'inherit', cursor:'pointer',
        }}>+ Ajouter la tâche</button>
      </div>

      {/* Tip */}
      <div style={{ margin:'0 20px', background:'#FFE8EC', border:'1px solid rgba(232,99,122,0.2)', borderRadius:12, padding:'14px 16px', display:'flex', gap:12 }}>
        <span style={{ fontSize:24 }}>🎯</span>
        <div style={{ fontSize:13, color:'#1A1025' }}>
          <strong style={{ display:'block', color:'#E8637A', marginBottom:2 }}>Règle des 3 tâches</strong>
          Chaque matin, identifie tes 3 tâches non-négociables. Le reste est bonus.
        </div>
      </div>
    </div>
  );
}

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 14px', textAlign:'center' }}>
      <div style={{ fontSize:22, fontWeight:700 }}>{num}</div>
      <div style={{ fontSize:10, opacity:0.8 }}>{label}</div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  border:'1px solid rgba(107,63,160,0.15)', borderRadius:8, padding:'8px 10px',
  fontSize:12, fontFamily:'inherit', background:'#FAF8FF', color:'#1A1025', outline:'none', cursor:'pointer',
};
