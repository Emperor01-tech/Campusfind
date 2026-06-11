import { useState } from 'react'
import axios from 'axios'

export default function ShareButton({ onSessionCreated }) {
  const [loading,  setLoading]  = useState(false)
  const [copied,   setCopied]   = useState(false)
  const [link,     setLink]     = useState(null)

  async function handleShare() {
    setLoading(true)
    try {
      const res  = await axios.post('http://localhost:5000/api/meet/create')
      const code = res.data.code
      const url  = `${window.location.origin}/meet/${code}`
      setLink(url)
      onSessionCreated(code)

      // Copy link to clipboard
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Failed to create session:', err)
    }
    setLoading(false)
  }

  function openWhatsApp() {
    if (!link) return
    const msg = `Hey! Meet me on campus 🗺️ Click this link to see where I am live:\n${link}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div style={{
      position:  'absolute',
      bottom:    90,
      left:      16,
      zIndex:    1000,
      display:   'flex',
      flexDirection: 'column',
      gap:       8,
      alignItems: 'flex-start',
    }}>

      {/* Share button */}
      <button onClick={handleShare} disabled={loading}
        style={{
          background:    loading ? '#94A3B8' : 'linear-gradient(135deg, #00D26A, #0EA5E9)',
          border:        'none',
          borderRadius:  12,
          padding:       '10px 16px',
          color:         'white',
          fontWeight:    700,
          fontSize:      13,
          cursor:        loading ? 'not-allowed' : 'pointer',
          boxShadow:     '0 2px 12px rgba(0,210,106,0.4)',
          display:       'flex',
          alignItems:    'center',
          gap:           8,
          whiteSpace:    'nowrap',
        }}
      >
        {loading ? '⏳ Creating...' : '📍 Share My Location'}
      </button>

      {/* Link actions — show after session created */}
      {link && (
        <div style={{
          background:   'white',
          borderRadius: 12,
          padding:      '10px 14px',
          boxShadow:    '0 4px 16px rgba(0,0,0,0.15)',
          display:      'flex',
          flexDirection:'column',
          gap:          8,
          maxWidth:     220,
        }}>
          {/* Link preview */}
          <div style={{ fontSize: 10, color: '#64748B', wordBreak: 'break-all' }}>
            🔗 {link}
          </div>

          {/* Copied badge */}
          {copied && (
            <div style={{
              fontSize: 11, color: '#00D26A',
              fontWeight: 700,
            }}>
              ✅ Link copied to clipboard!
            </div>
          )}

          {/* WhatsApp button */}
          <button onClick={openWhatsApp}
            style={{
              background:   '#25D366',
              border:       'none',
              borderRadius: 8,
              padding:      '8px 12px',
              color:        'white',
              fontWeight:   700,
              fontSize:     12,
              cursor:       'pointer',
              display:      'flex',
              alignItems:   'center',
              gap:          6,
            }}
          >
            💬 Send on WhatsApp
          </button>

          {/* Copy again */}
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(link)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            style={{
              background:   '#F1F5F9',
              border:       '1px solid #E2E8F0',
              borderRadius: 8,
              padding:      '6px 12px',
              color:        '#64748B',
              fontSize:     11,
              cursor:       'pointer',
            }}
          >
            📋 Copy link again
          </button>
        </div>
      )}
    </div>
  )
}