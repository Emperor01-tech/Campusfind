import { useState } from 'react'
import { submitFeedback } from '../api'

export default function FeedbackWidget() {
  const [open,      setOpen]      = useState(false)
  const [message,   setMessage]   = useState('')
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)

  async function handleSubmit() {
    if (!message.trim()) return
    setSending(true)
    try {
      await submitFeedback(message.trim(), window.location.pathname)
      setSent(true)
      setMessage('')
      setTimeout(() => {
        setSent(false)
        setOpen(false)
      }, 2000)
    } catch {
      alert('Could not send feedback — check your connection and try again.')
    }
    setSending(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position:   'fixed',
          bottom:     16,
          right:      16,
          zIndex:     1400,
          width:      48,
          height:     48,
          borderRadius: '50%',
          background: '#1E293B',
          border:     '1px solid #334155',
          color:      '#94A3B8',
          fontSize:   20,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor:     'pointer',
          boxShadow:  '0 4px 16px rgba(0,0,0,0.3)',
        }}
        title="Report a problem or give feedback"
      >
        💬
      </button>

      {/* Modal */}
      {open && (
        <div style={{
          position:   'fixed',
          inset:      0,
          zIndex:     1500,
          background: 'rgba(11,17,32,0.6)',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding:    20,
        }}>
          <div style={{
            background:   '#1E293B',
            border:       '1px solid #334155',
            borderRadius: 16,
            padding:      '22px 22px',
            width:        '100%',
            maxWidth:     360,
            boxShadow:    '0 20px 60px rgba(0,0,0,0.4)',
          }}>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#00D26A' }}>
                  Thanks! Your feedback was sent.
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'white', marginBottom: 6 }}>
                  💬 Something wrong?
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 14 }}>
                  Tell us what happened — a bug, confusing screen, or anything that didn't work right.
                </div>

                <textarea
                  autoFocus
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="e.g. The green path didn't show up when I searched HOD Physics..."
                  rows={4}
                  style={{
                    width:        '100%',
                    padding:      '10px 12px',
                    background:   '#0B1120',
                    border:       '1.5px solid #334155',
                    borderRadius: 10,
                    color:        'white',
                    fontSize:     13,
                    outline:      'none',
                    resize:       'none',
                    boxSizing:    'border-box',
                    marginBottom: 14,
                    fontFamily:   'inherit',
                  }}
                />

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={handleSubmit}
                    disabled={sending || !message.trim()}
                    style={{
                      flex:         1,
                      padding:      '10px',
                      background:   message.trim() ? 'linear-gradient(135deg, #00D26A, #0EA5E9)' : '#334155',
                      border:       'none',
                      borderRadius: 10,
                      color:        'white',
                      fontWeight:   700,
                      fontSize:     13,
                      cursor:       message.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {sending ? 'Sending...' : 'Send Feedback'}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    style={{
                      padding:      '10px 16px',
                      background:   '#0B1120',
                      border:       '1px solid #334155',
                      borderRadius: 10,
                      color:        '#94A3B8',
                      fontSize:     13,
                      cursor:       'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}