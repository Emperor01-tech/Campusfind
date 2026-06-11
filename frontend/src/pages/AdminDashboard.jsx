import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import {
  fetchLocations,
  adminLogout,
  adminCheck,
  adminAddLocation,
  adminUpdateLocation,
  adminDeleteLocation,
} from '../api'
import LocationForm from '../components/LocationForm'

export default function AdminDashboard() {
  const [locations,  setLocations]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [formLoading,setFormLoading]= useState(false)
  const [showForm,   setShowForm]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [search,     setSearch]     = useState('')
  const [message,    setMessage]    = useState(null)
  const [filter,     setFilter]     = useState('all')
  const navigate = useNavigate()

  // Check admin is logged in
  useEffect(() => {
    adminCheck()
      .then(res => {
        if (!res.data.authenticated) navigate('/admin')
        else loadLocations()
      })
      .catch(() => navigate('/admin'))
  }, [])

  async function loadLocations() {
    try {
      const res = await fetchLocations()
      setLocations(res.data)
    } finally {
      setLoading(false)
    }
  }

  function showMsg(text, type = 'success') {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  async function handleAdd(data) {
    setFormLoading(true)
    try {
      await adminAddLocation(data)
      await loadLocations()
      setShowForm(false)
      showMsg('✅ Location added successfully')
    } catch {
      showMsg('❌ Failed to add location', 'error')
    }
    setFormLoading(false)
  }

  async function handleEdit(data) {
    setFormLoading(true)
    try {
      await adminUpdateLocation(editTarget.id, data)
      await loadLocations()
      setEditTarget(null)
      showMsg('✅ Location updated successfully')
    } catch {
      showMsg('❌ Failed to update location', 'error')
    }
    setFormLoading(false)
  }

  async function handleDelete(loc) {
    if (!window.confirm(`Delete "${loc.name}"? This cannot be undone.`)) return
    try {
      await adminDeleteLocation(loc.id)
      await loadLocations()
      showMsg(`🗑️ "${loc.name}" deleted`)
    } catch {
      showMsg('❌ Failed to delete location', 'error')
    }
  }

  async function handleLogout() {
    await adminLogout()
    navigate('/admin')
  }

  const filtered = locations.filter(loc => {
    const matchesSearch =
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.building?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || loc.category === filter
    return matchesSearch && matchesFilter
  })

  const FILTERS = ['all', 'admin', 'faculty', 'facility', 'amenity']

  const categoryColors = {
    admin:    '#F59E0B',
    faculty:  '#A855F7',
    facility: '#06B6D4',
    amenity:  '#10B981',
  }

  return (
    <div style={{
      minHeight:  '100vh',
      background: '#0B1120',
      fontFamily: 'Segoe UI, sans-serif',
      color:      'white',
    }}>

      {/* ── HEADER ── */}
      <div style={{
        background:   '#1E293B',
        borderBottom: '1px solid #334155',
        padding:      '14px 24px',
        display:      'flex',
        alignItems:   'center',
        gap:          12,
        position:     'sticky',
        top:          0,
        zIndex:       100,
      }}>
        <div style={{ fontSize: 24 }}>🗺️</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>
            Campus<span style={{ color: '#00D26A' }}>Find</span> Admin
          </div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            OOU Ago-Iwoye · {locations.length} locations
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          <a href="/" target="_blank" rel="noreferrer"
            style={{
              padding:      '7px 14px',
              background:   '#0B1120',
              border:       '1px solid #334155',
              borderRadius: 8,
              color:        '#94A3B8',
              fontSize:     12,
              textDecoration:'none',
              fontWeight:   600,
            }}>
            🗺️ View Map
          </a>
          <button onClick={handleLogout}
            style={{
              padding:      '7px 14px',
              background:   '#EF444420',
              border:       '1px solid #EF444455',
              borderRadius: 8,
              color:        '#EF4444',
              fontSize:     12,
              cursor:       'pointer',
              fontWeight:   600,
            }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 20px' }}>

        {/* ── SUCCESS / ERROR MESSAGE ── */}
        {message && (
          <div style={{
            background:   message.type === 'error' ? '#EF444420' : '#00D26A20',
            border:       `1px solid ${message.type === 'error' ? '#EF4444' : '#00D26A'}55`,
            borderRadius: 10,
            padding:      '10px 16px',
            marginBottom: 20,
            fontSize:     13,
            color:        message.type === 'error' ? '#EF4444' : '#00D26A',
            fontWeight:   600,
          }}>
            {message.text}
          </div>
        )}

        {/* ── ADD FORM ── */}
        {showForm && !editTarget && (
          <div style={{
            background:   '#1E293B',
            border:       '1px solid #334155',
            borderRadius: 14,
            padding:      '20px 24px',
            marginBottom: 24,
          }}>
            <div style={{
              fontSize:     15,
              fontWeight:   700,
              marginBottom: 20,
              color:        '#00D26A',
            }}>
              ➕ Add New Location
            </div>
            <LocationForm
              onSubmit={handleAdd}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </div>
        )}

        {/* ── EDIT FORM ── */}
        {editTarget && (
          <div style={{
            background:   '#1E293B',
            border:       '1px solid #334155',
            borderLeft:   `4px solid ${editTarget.color || '#00D26A'}`,
            borderRadius: 14,
            padding:      '20px 24px',
            marginBottom: 24,
          }}>
            <div style={{
              fontSize:     15,
              fontWeight:   700,
              marginBottom: 20,
              color:        '#F59E0B',
            }}>
              ✏️ Editing: {editTarget.name}
            </div>
            <LocationForm
              initial={editTarget}
              onSubmit={handleEdit}
              onCancel={() => setEditTarget(null)}
              loading={formLoading}
            />
          </div>
        )}

        {/* ── TOOLBAR ── */}
        <div style={{
          display:       'flex',
          alignItems:    'center',
          gap:           12,
          marginBottom:  20,
          flexWrap:      'wrap',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{
              position:  'absolute',
              left:      12,
              top:       '50%',
              transform: 'translateY(-50%)',
              fontSize:  15,
            }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search locations..."
              style={{
                width:        '100%',
                padding:      '9px 12px 9px 36px',
                background:   '#1E293B',
                border:       '1.5px solid #334155',
                borderRadius: 10,
                color:        'white',
                fontSize:     13,
                outline:      'none',
                boxSizing:    'border-box',
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding:      '7px 14px',
                  borderRadius: 99,
                  fontSize:     11,
                  fontWeight:   700,
                  border:       filter === f
                    ? `1.5px solid ${categoryColors[f] || '#00D26A'}`
                    : '1.5px solid #334155',
                  background:   filter === f
                    ? (categoryColors[f] || '#00D26A') + '20'
                    : '#1E293B',
                  color:        filter === f
                    ? (categoryColors[f] || '#00D26A')
                    : '#94A3B8',
                  cursor:       'pointer',
                  textTransform:'capitalize',
                }}>
                {f}
              </button>
            ))}
          </div>

          {/* Add button */}
          <button
            onClick={() => { setShowForm(true); setEditTarget(null) }}
            style={{
              padding:      '9px 18px',
              background:   'linear-gradient(135deg, #00D26A, #0EA5E9)',
              border:       'none',
              borderRadius: 10,
              color:        'white',
              fontWeight:   700,
              fontSize:     13,
              cursor:       'pointer',
              whiteSpace:   'nowrap',
              boxShadow:    '0 2px 12px rgba(0,210,106,0.3)',
            }}>
            ➕ Add Location
          </button>
        </div>

        {/* ── LOCATIONS TABLE ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
            ⏳ Loading locations...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
            No locations found
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(loc => (
              <div key={loc.id} style={{
                background:   '#1E293B',
                border:       '1px solid #334155',
                borderLeft:   `4px solid ${loc.color || '#6B7280'}`,
                borderRadius: 12,
                padding:      '14px 18px',
                display:      'flex',
                alignItems:   'center',
                gap:          14,
              }}>
                {/* Icon */}
                <div style={{
                  width:          40,
                  height:         40,
                  background:     (loc.color || '#6B7280') + '22',
                  border:         `1px solid ${loc.color || '#6B7280'}55`,
                  borderRadius:   10,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       20,
                  flexShrink:     0,
                }}>
                  {loc.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {loc.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                    {loc.building && `📍 ${loc.building}`}
                    {loc.room     && ` · ${loc.room}`}
                    {loc.description && ` — ${loc.description}`}
                  </div>
                  <div style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>
                    🌍 {loc.lat}, {loc.lng}
                  </div>
                </div>

                {/* Category badge */}
                <div style={{
                  fontSize:      11,
                  fontWeight:    700,
                  color:         categoryColors[loc.category] || '#6B7280',
                  background:    (categoryColors[loc.category] || '#6B7280') + '18',
                  padding:       '3px 10px',
                  borderRadius:  99,
                  textTransform: 'capitalize',
                  flexShrink:    0,
                }}>
                  {loc.category}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => { setEditTarget(loc); setShowForm(false) }}
                    style={{
                      padding:      '6px 14px',
                      background:   '#F59E0B20',
                      border:       '1px solid #F59E0B55',
                      borderRadius: 8,
                      color:        '#F59E0B',
                      fontSize:     12,
                      fontWeight:   700,
                      cursor:       'pointer',
                    }}>
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(loc)}
                    style={{
                      padding:      '6px 14px',
                      background:   '#EF444420',
                      border:       '1px solid #EF444455',
                      borderRadius: 8,
                      color:        '#EF4444',
                      fontSize:     12,
                      fontWeight:   700,
                      cursor:       'pointer',
                    }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STATS FOOTER ── */}
        <div style={{
          marginTop:  24,
          padding:    '16px 20px',
          background: '#1E293B',
          border:     '1px solid #334155',
          borderRadius: 12,
          display:    'flex',
          gap:        24,
          flexWrap:   'wrap',
        }}>
          {['admin', 'faculty', 'facility', 'amenity'].map(cat => (
            <div key={cat} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize:   20,
                fontWeight: 800,
                color:      categoryColors[cat],
              }}>
                {locations.filter(l => l.category === cat).length}
              </div>
              <div style={{
                fontSize:      11,
                color:         '#64748B',
                textTransform: 'capitalize',
              }}>
                {cat}
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>
              {locations.length}
            </div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Total</div>
          </div>
        </div>

      </div>
    </div>
  )
}