import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../api'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    if (!password.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await adminLogin(password)
      if (res.data.success) {
        navigate('/admin/dashboard')
      }
    } catch {
      setError('Wrong password. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0B1120',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontFamily:     'Segoe UI, sans-serif',
    }}>
      <div style={{
        background:   '#1E293B',
        border:       '1px solid #334155',
        borderRadius: 16,
        padding:      '40px 36px',
        width:        '100%',
        maxWidth:     380,
        boxShadow:    '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>
            Campus<span style={{ color: '#00D26A' }}>Find</span>
          </div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
            Admin Panel — OOU Ago-Iwoye
          </div>
        </div>

        {/* Password input */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display:      'block',
            fontSize:     12,
            fontWeight:   600,
            color:        '#94A3B8',
            marginBottom: 6,
            textTransform:'uppercase',
            letterSpacing:'0.05em',
          }}>
            Admin Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            style={{
              width:        '100%',
              padding:      '11px 14px',
              background:   '#0B1120',
              border:       '1.5px solid #334155',
              borderRadius: 10,
              color:        'white',
              fontSize:     14,
              outline:      'none',
              boxSizing:    'border-box',
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background:   '#EF444420',
            border:       '1px solid #EF444455',
            borderRadius: 8,
            padding:      '8px 12px',
            fontSize:     13,
            color:        '#EF4444',
            marginBottom: 16,
          }}>
            ❌ {error}
          </div>
        )}

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width:        '100%',
            padding:      '12px',
            background:   loading
              ? '#334155'
              : 'linear-gradient(135deg, #00D26A, #0EA5E9)',
            border:       'none',
            borderRadius: 10,
            color:        'white',
            fontWeight:   700,
            fontSize:     14,
            cursor:       loading ? 'not-allowed' : 'pointer',
            boxShadow:    '0 4px 16px rgba(0,210,106,0.3)',
          }}
        >
          {loading ? '⏳ Logging in...' : '🔐 Login to Admin Panel'}
        </button>

        <div style={{
          textAlign:  'center',
          marginTop:  20,
          fontSize:   12,
          color:      '#334155',
        }}>
          <a href="/" style={{ color: '#64748B', textDecoration: 'none' }}>
            ← Back to Campus Map
          </a>
        </div>
      </div>
    </div>
  )
}