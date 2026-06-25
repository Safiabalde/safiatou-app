'use client';
import { useEffect, useState } from 'react';

let toastFn: (msg: string) => void = () => {};
export const showToast = (msg: string) => toastFn(msg);

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    toastFn = (m: string) => {
      setMsg(m);
      setVisible(true);
      setTimeout(() => setVisible(false), 2500);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 20, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '-120px'})`,
      background: '#6B3FA0', color: 'white', padding: '12px 24px',
      borderRadius: 30, fontSize: 13, fontWeight: 600,
      zIndex: 999, transition: 'transform 0.3s ease', whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(107,63,160,0.4)',
    }}>{msg}</div>
  );
}
