import { useState, useEffect } from 'react'

const CATEGORIES = ['admin', 'faculty', 'facility', 'amenity']
const TYPES      = ['building', 'office']
const COLORS     = [
  { label: 'Amber',   value: '#F59E0B' },
  { label: 'Blue',    value: '#3B82F6' },
  { label: 'Purple',  value: '#A855F7' },
  { label: 'Pink',    value: '#EC4899' },
  { label: 'Cyan',    value: '#06B6D4' },
  { label: 'Green',   value: '#10B981' },
  { label: 'Red',     value: '#EF4444' },
  { label: 'Orange',  value: '#F97316' },
  { label: 'Gray',    value: '#64748B' },
]

const EMPTY = {
  name: '', type: 'building', category: 'admin',
  description: '', building: '', room: '',
  lat: '', lng: '', icon: '📍', color: '#F59E0B',
}

export default function LocationForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial || EMPTY)

  useEffect(() => {
    setForm(initial || EMPTY)
  }, [initial])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSubmit() {
    if (!form.name || !form.lat || !form.lng) {
      alert('Name, Latitude and Longitude are required.')
      return
    }
    onSubmit({ ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) })
  }

  const inputStyle = {
    width:        '100%',
    padding:      '9px 12px',
    background:   '#0B1120',
    border:       '1.5px solid #334155',
    borderRadius: 8,
    color:        'white',
    fontSize:     13,
    outline:      'none',
    boxSizing:    'border-box',
  }

  const labelStyle = {
    display:      'block',
    fontSize:     11,
    fontWeight:   600,
    color:        '#94A3B8',
    marginBottom: 4,
    textTransform:'uppercase',
    letterSpacing:'0.05em',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Name */}
      <div>
        <label style={labelStyle}>Location Name *</label>
        <input style={inputStyle} value={form.name}
          placeholder="e.g. HOD Physics"
          onChange={e => set('name', e.target.value)} />
      </div>

      {/* Type + Category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Type</label>
          <select style={inputStyle} value={form.type}
            onChange={e => set('type', e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select style={inputStyle} value={form.category}
            onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <input style={inputStyle} value={form.description}
          placeholder="Short description"
          onChange={e => set('description', e.target.value)} />
      </div>

      {/* Building + Room */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Building</label>
          <input style={inputStyle} value={form.building}
            placeholder="e.g. Science Block"
            onChange={e => set('building', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Room</label>
          <input style={inputStyle} value={form.room}
            placeholder="e.g. Room 201"
            onChange={e => set('room', e.target.value)} />
        </div>
      </div>

      {/* Lat + Lng */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Latitude *</label>
          <input style={inputStyle} value={form.lat}
            placeholder="e.g. 6.9211"
            onChange={e => set('lat', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Longitude *</label>
          <input style={inputStyle} value={form.lng}
            placeholder="e.g. 3.8673"
            onChange={e => set('lng', e.target.value)} />
        </div>
      </div>

      {/* How to get coords tip */}
      <div style={{
        background:   '#00D26A0D',
        border:       '1px solid #00D26A33',
        borderRadius: 8,
        padding:      '8px 12px',
        fontSize:     11,
        color:        '#86EFAC',
      }}>
        💡 To get coordinates: Go to Google Maps → right-click the building → copy the numbers shown at the top
      </div>

      {/* Icon + Color */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Icon (emoji)</label>
          <input style={inputStyle} value={form.icon}
            placeholder="e.g. 📍"
            onChange={e => set('icon', e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Marker Color</label>
          <select style={{ ...inputStyle, paddingLeft: 8 }}
            value={form.color}
            onChange={e => set('color', e.target.value)}>
            {COLORS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Color preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width:        28,
          height:       28,
          borderRadius: '50% 50% 50% 0',
          transform:    'rotate(-45deg)',
          background:   form.color,
          border:       '2px solid white',
          boxShadow:    '0 2px 8px rgba(0,0,0,0.3)',
        }} />
        <span style={{ fontSize: 11, color: '#64748B' }}>
          Marker preview
        </span>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex:         1,
            padding:      '10px',
            background:   'linear-gradient(135deg, #00D26A, #0EA5E9)',
            border:       'none',
            borderRadius: 8,
            color:        'white',
            fontWeight:   700,
            fontSize:     13,
            cursor:       'pointer',
          }}
        >
          {loading ? '⏳ Saving...' : '✅ Save Location'}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding:      '10px 16px',
            background:   '#1E293B',
            border:       '1px solid #334155',
            borderRadius: 8,
            color:        '#94A3B8',
            fontSize:     13,
            cursor:       'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}