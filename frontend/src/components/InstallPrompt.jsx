import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow]                     = useState(false)
  const [dismissed, setDismissed]            = useState(false)

  useEffect(() => {
    // Don't show again if user dismissed before
    const wasDismissed = localStorage.getItem('installPromptDismissed')
    if (wasDismissed) return

    function handler(e) {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
    }
  }

  function handleDismiss() {
    setShow(false)
    setDismissed(true)
    localStorage.setItem('installPromptDismissed', 'true')
  }

  if (!show || dismissed) return null

  return (
    <div style={{
      position:   'fixed',
      bottom:     16,
      left:       '50%',
      transform:  'translateX(-50%)',
      zIndex:     1500,
      width:      '92%',
      maxWidth:   380,
      background: '#1E293B',
      border:     '1px solid #00D26A55',
      borderRadius: 16,
      padding:    '14px 16px',
      display:    'flex',
      alignItems: 'center',
      gap:        12,
      boxShadow:  '0 10px 40px rgba(0,0,0,0.4)',
      animation:  'slideUp 0.3s ease',
    }}>
      <style>{`
        @keyframes slideUp { from { transform:translate(-50%, 100%); opacity:0 } to { transform:translate(-50%, 0); opacity:1 } }
      `}</style>

      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: 'linear-gradient(135deg, #00D26A, #0EA5E9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>
        🗺️
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
          Install CampusFind
        </div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>
          Add to home screen for quick access
        </div>
      </div>

      <button onClick={handleDismiss} style={{
        background: 'transparent', border: 'none',
        color: '#64748B', fontSize: 18, cursor: 'pointer',
        padding: 4, flexShrink: 0,
      }}>✕</button>

      <button onClick={handleInstall} style={{
        background:   'linear-gradient(135deg, #00D26A, #0EA5E9)',
        border:       'none',
        borderRadius: 8,
        padding:      '8px 14px',
        color:        'white',
        fontWeight:   700,
        fontSize:     12,
        cursor:       'pointer',
        flexShrink:   0,
        whiteSpace:   'nowrap',
      }}>
        Install
      </button>
    </div>
  )
}