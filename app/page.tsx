'use client';
import { useState, useEffect } from 'react';
import { loadState, saveState } from '@/lib/store';
import { AppState } from '@/lib/data';
import { registerSW } from '@/lib/notifications';
import Toast from '@/components/Toast';
import HomeScreen from '@/components/HomeScreen';
import TasksScreen from '@/components/TasksScreen';
import SportScreen from '@/components/SportScreen';
import BilanScreen from '@/components/BilanScreen';

type Tab = 'home' | 'tasks' | 'sport' | 'bilan';

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [state, setStateRaw] = useState<AppState | null>(null);

  useEffect(() => {
    setStateRaw(loadState());
    registerSW();
  }, []);

  function setState(s: AppState) {
    setStateRaw(s);
    saveState(s);
  }

  if (!state) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16, color:'#6B3FA0' }}>
      <div style={{ fontSize:40 }}>✨</div>
      <div style={{ fontSize:16, fontFamily:'Georgia,serif', fontStyle:'italic' }}>Chargement de ta routine…</div>
    </div>
  );

  const NAV = [
    { id:'home' as Tab, emoji:'🏠', label:'Accueil' },
    { id:'tasks' as Tab, emoji:'✅', label:'Tâches' },
    { id:'sport' as Tab, emoji:'💪', label:'Sport' },
    { id:'bilan' as Tab, emoji:'📊', label:'Bilan' },
  ];

  return (
    <div style={{ maxWidth:430, margin:'0 auto', position:'relative', minHeight:'100vh', background:'#FAF8FF' }}>
      <Toast />

      {tab === 'home'  && <HomeScreen  state={state} setState={setState} />}
      {tab === 'tasks' && <TasksScreen state={state} setState={setState} />}
      {tab === 'sport' && <SportScreen state={state} setState={setState} />}
      {tab === 'bilan' && <BilanScreen state={state} setState={setState} />}

      {/* Bottom Nav */}
      <nav style={{
        position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:'100%', maxWidth:430,
        background:'white', borderTop:'1px solid rgba(107,63,160,0.12)',
        display:'flex', zIndex:100,
        paddingBottom:'env(safe-area-inset-bottom)',
      }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            padding:'10px 4px 8px', cursor:'pointer', border:'none',
            background: 'none',
            color: tab === n.id ? '#6B3FA0' : '#B8A8CC',
            fontSize:10, fontFamily:'inherit', gap:3, transition:'color 0.2s',
          }}>
            <span style={{ fontSize:20 }}>{n.emoji}</span>
            <span style={{ fontWeight: tab===n.id ? 600 : 400 }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
