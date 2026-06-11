import { useState, useEffect, useRef } from 'react'
import { searchLocations } from '../api'

export default function SearchBar({ onSelect }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open,    setOpen]    = useState(false)
  const debounceRef           = useRef(null)
  const wrapperRef            = useRef(null)

  // Search as user types with 300ms debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    // Debounce — don't fire on every single keystroke
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setLoading(true)
      searchLocations(query)
        .then(res => {
          setResults(res.data)
          setOpen(true)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(location) {
    setQuery(location.name)
    setOpen(false)
    onSelect(location)  // sends selected location up to App.jsx
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  // Color badge per category
  const categoryColors = {
    admin:    '#F59E0B',
    faculty:  '#A855F7',
    facility: '#06B6D4',
    amenity:  '#10B981',
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        position:  'absolute',
        top:       16,
        left:      '50%',
        transform: 'translateX(-50%)',
        width:     '90%',
        maxWidth:  480,
        zIndex:    1000,
      }}
    >
      {/* Search input */}
      <div style={{
        display:      'flex',
        alignItems:   'center',
        background:   'white',
        borderRadius: open && results.length > 0 ? '12px 12px 0 0' : 12,
        boxShadow:    '0 4px 20px rgba(0,0,0,0.15)',
        padding:      '10px 14px',
        gap:          10,
        border:       '2px solid #00D26A',
      }}>
        {/* Search icon */}
        <span style={{ fontSize: 18 }}>🔍</span>

        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search building, office, faculty..."
          style={{
            flex:       1,
            border:     'none',
            outline:    'none',
            fontSize:   14,
            fontWeight: 500,
            color:      '#1E293B',
            background: 'transparent',
          }}
        />

        {/* Loading spinner */}
        {loading && (
          <span style={{ fontSize: 14, color: '#94A3B8' }}>⏳</span>
        )}

        {/* Clear button */}
        {query && !loading && (
          <button
            onClick={handleClear}
            style={{
              background:   '#F1F5F9',
              border:       'none',
              borderRadius: '50%',
              width:        22,
              height:       22,
              cursor:       'pointer',
              fontSize:     12,
              color:        '#64748B',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
            }}
          >✕</button>
        )}
      </div>

      {/* Dropdown results */}
      {open && (
        <div style={{
          background:   'white',
          borderRadius: '0 0 12px 12px',
          boxShadow:    '0 8px 20px rgba(0,0,0,0.12)',
          maxHeight:    320,
          overflowY:    'auto',
          border:       '2px solid #00D26A',
          borderTop:    'none',
        }}>
          {results.length === 0 ? (
            <div style={{
              padding:    '16px',
              textAlign:  'center',
              color:      '#94A3B8',
              fontSize:   13,
            }}>
              😕 No location found for "<strong>{query}</strong>"
            </div>
          ) : (
            results.map((loc, i) => (
              <div
                key={loc.id}
                onClick={() => handleSelect(loc)}
                style={{
                  padding:       '10px 14px',
                  cursor:        'pointer',
                  display:       'flex',
                  alignItems:    'center',
                  gap:           12,
                  borderBottom:  i < results.length - 1 ? '1px solid #F1F5F9' : 'none',
                  transition:    'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                {/* Icon bubble */}
                <div style={{
                  background:    (loc.color || '#6B7280') + '22',
                  border:        `1px solid ${loc.color || '#6B7280'}55`,
                  borderRadius:  10,
                  width:         38,
                  height:        38,
                  display:       'flex',
                  alignItems:    'center',
                  justifyContent:'center',
                  fontSize:      18,
                  flexShrink:    0,
                }}>
                  {loc.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize:     13,
                    fontWeight:   700,
                    color:        '#1E293B',
                    whiteSpace:   'nowrap',
                    overflow:     'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {loc.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                    {loc.building
                      ? `📍 ${loc.building}${loc.room ? ' · ' + loc.room : ''}`
                      : loc.description}
                  </div>
                </div>

                {/* Category badge */}
                <div style={{
                  fontSize:      10,
                  fontWeight:    700,
                  color:         categoryColors[loc.category] || '#6B7280',
                  background:    (categoryColors[loc.category] || '#6B7280') + '18',
                  padding:       '3px 8px',
                  borderRadius:  99,
                  flexShrink:    0,
                  textTransform: 'capitalize',
                }}>
                  {loc.category}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}