import { useEffect, useState } from 'react'

export default function ArrivalBanner({ arrived, location, onDismiss }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (arrived) {
      setShow(true)
      // Play a soft notification sound
      try {
        const audio = new Audio(
          'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='
        )
        audio.play().catch(() => {})
      } catch {}

      // Vibrate on supported phones
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
    } else {
      setShow(false)
    }
  }, [arrived])

  if (!show || !location) return null

  return (
    <div style={{
      position:   'fixed',
      top:        0, left: 0, right: 0, bottom: 0,
      zIndex:     2000,
      background: 'rgba(11,17,32,0.55)',
      display:    'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation:  'fadeIn 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn    { 0% { transform:scale(0.7); opacity:0 } 100% { transform:scale(1); opacity:1 } }
        @keyframes ringPulse{ 0% { transform:scale(1); opacity:0.6 } 100% { transform:scale(2.2); opacity:0 } }
      `}</style>

      <div style={{
        background:   'linear-gradient(160deg, #1E293B, #0B1120)',
        border:       '1px solid #00D26A55',
        borderRadius: 20,
        padding:      '32px 28px',
        width:        '88%',
        maxWidth:     340,
        textAlign:    'center',
        boxShadow:    '0 20px 60px rgba(0,210,106,0.25)',
        animation:    'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>

        {/* Pulsing checkmark */}
        <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 16px' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#00D26A', borderRadius: '50%',
            animation: 'ringPulse 1.6s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #00D26A, #0EA5E9)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>
            ✅
          </div>
        </div>

        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>
          YOU HAVE ARRIVED
        </div>

        <div style={{ fontSize: 19, fontWeight: 800, color: 'white', marginBottom: 6 }}>
          {location.icon} {location.name}
        </div>

        {location.room && (
          <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 4 }}>
            📍 {location.building} · {location.room}
          </div>
        )}

        {location.description && (
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>
            {location.description}
          </div>
        )}

        <button onClick={onDismiss} style={{
          width: '100%', padding: '12px',
          background: 'linear-gradient(135deg, #00D26A, #0EA5E9)',
          border: 'none', borderRadius: 12,
          color: 'white', fontWeight: 700, fontSize: 14,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,210,106,0.3)',
        }}>
          🎉 Got it, thanks!
        </button>
      </div>
    </div>
  )
}