export default function GPSStatusBar({ accuracy, error, loading }) {

  // Accuracy quality label
  function getQuality() {
    if (!accuracy) return null
    if (accuracy <= 10)  return { label: 'Excellent',  color: '#00D26A' }
    if (accuracy <= 30)  return { label: 'Good',       color: '#10B981' }
    if (accuracy <= 60)  return { label: 'Fair',       color: '#F59E0B' }
    return                      { label: 'Poor',       color: '#EF4444' }
  }

  const quality = getQuality()

  if (loading) return (
    <div style={barStyle}>
      <span style={{ fontSize: 12 }}>⏳ Getting your GPS location...</span>
    </div>
  )

  if (error) return (
    <div style={{ ...barStyle, borderColor: '#EF444455' }}>
      <span style={{ fontSize: 11, color: '#94A3B8' }}>⚠️ {error}</span>
    </div>
  )

  return (
    <div style={barStyle}>
      {/* Blinking green dot */}
      <div style={{
        width:        8,
        height:       8,
        borderRadius: '50%',
        background:   quality?.color || '#00D26A',
        boxShadow:    `0 0 6px ${quality?.color || '#00D26A'}`,
        animation:    'gpsBlink 1.5s ease infinite',
        flexShrink:   0,
      }} />

      <span style={{ fontSize: 11, color: '#CBD5E1' }}>
        GPS Active
      </span>

      {accuracy && (
        <span style={{
          fontSize:   10,
          color:      quality?.color,
          fontWeight: 600,
          background: (quality?.color || '#00D26A') + '18',
          padding:    '2px 8px',
          borderRadius: 99,
        }}>
          ±{accuracy}m · {quality?.label}
        </span>
      )}

      <style>{`
        @keyframes gpsBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

const barStyle = {
  position:      'absolute',
  bottom:        16,
  left:          '50%',
  transform:     'translateX(-50%)',
  zIndex:        1000,
  background:    '#1E293B',
  border:        '1px solid #334155',
  borderRadius:  99,
  padding:       '6px 14px',
  display:       'flex',
  alignItems:    'center',
  gap:           8,
  whiteSpace:    'nowrap',
  boxShadow:     '0 2px 12px rgba(0,0,0,0.3)',
}