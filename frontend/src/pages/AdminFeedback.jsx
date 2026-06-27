import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { fetchFeedback, resolveFeedback, adminCheck } from '../api'

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('open') // 'open' | 'resolved' | 'all'
  const navigate = useNavigate()

  useEffect(() => {
    adminCheck()
      .then(res => {
        if (!res.data.authenticated) navigate('/admin')
        else load()
      })
      .catch(() => navigate('/admin'))
  }, [])

  async function load() {
    try {
      const res = await fetchFeedback()
      setFeedback(res.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleResolve(id) {
    try {
      await resolveFeedback(id)
      await load()
    } catch {
      alert('Failed to mark as resolved')
    }
  }

  const filtered = feedback.filter(f => {
    if (filter === 'open')     return !f.resolved
    if (filter === 'resolved') return f.resolved
    return true
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0B1120', fontFamily: 'Segoe UI, sans-serif', color: 'white' }}>

      <div style={{
        background: '#1E293B', borderBottom: '1px solid #334155', padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ fontSize: 24 }}>💬</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Student Feedback</div>
          <div style={{ fontSize: 11, color: '#64748B' }}>{feedback.filter(f => !f.resolved).length} unresolved</div>
        </div>
        <a href="/admin/dashboard" style={{
          marginLeft: 'auto', padding: '7px 14px', background: '#0B1120',
          border: '1px solid #334155', borderRadius: 8, color: '#94A3B8',
          fontSize: 12, textDecoration: 'none', fontWeight: 600,
        }}>
          ← Back to Dashboard
        </a>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px' }}>

        <div style={{
          display: 'flex', gap: 8, marginBottom: 20, background: '#1E293B', padding: 4,
          borderRadius: 12, border: '1px solid #334155', width: 'fit-content',
        }}>
          {['open', 'resolved', 'all'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: 9, border: 'none',
                background: filter === f ? 'linear-gradient(135deg, #00D26A, #0EA5E9)' : 'transparent',
                color: filter === f ? 'white' : '#94A3B8', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', textTransform: 'capitalize',
              }}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>⏳ Loading feedback...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 50, color: '#64748B' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
            <div>No feedback here yet</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(f => (
              <div key={f.id} style={{
                background: '#1E293B', border: '1px solid #334155',
                borderLeft: `4px solid ${f.resolved ? '#00D26A' : '#F59E0B'}`,
                borderRadius: 12, padding: '14px 18px',
              }}>
                <div style={{ fontSize: 13, color: 'white', lineHeight: 1.5, marginBottom: 8 }}>
                  {f.message}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#64748B' }}>
                  <span>📍 {f.page || 'unknown page'}</span>
                  <span>·</span>
                  <span>{new Date(f.created_at).toLocaleString()}</span>
                  {!f.resolved && (
                    <button onClick={() => handleResolve(f.id)} style={{
                      marginLeft: 'auto', padding: '4px 10px', background: '#00D26A20',
                      border: '1px solid #00D26A55', borderRadius: 7, color: '#00D26A',
                      fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    }}>
                      ✓ Mark Resolved
                    </button>
                  )}
                  {f.resolved && (
                    <span style={{ marginLeft: 'auto', color: '#00D26A', fontWeight: 700 }}>✓ Resolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}