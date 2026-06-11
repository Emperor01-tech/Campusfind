export default function MeetStatusBar({ distance, direction, friendJoined, connected }) {
  if (!connected) return null

  const directionConfig = {
    closer: { emoji: '🟢', text: 'Getting closer',  color: '#00D26A' },
    away:   { emoji: '🔴', text: 'Moving apart',    color: '#EF4444' },
    same:   { emoji: '🟡', text: 'Both standing by', color: '#F59E0B' },
  }

  const dir = directionConfig[direction]

  return (
    <div style={{
      position:      'absolute',
      top:           80,
      left:          '50%',
      transform:     'translateX(-50%)',
      zIndex:        1000,
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      gap:           6,
    }}>

      {/* Waiting for friend */}
      {!friendJoined && (
        <div style={{
          background:   '#1E293B',
          border:       '1px solid #334155',
          borderRadius: 99,
          padding:      '6px 16px',
          fontSize:     12,
          color:        '#94A3B8',
          display:      'flex',
          alignItems:   'center',
          gap:          8,
        }}>
          <span style={{ animation: 'spin 1s linear infinite', display:'inline-block' }}>⏳</span>
          Waiting for your friend to join...
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        </div>
      )}

      {/* Friend joined — show distance and direction */}
      {friendJoined && (
        <div style={{
          background:   '#1E293B',
          border:       `1px solid ${dir?.color || '#334155'}55`,
          borderRadius: 12,
          padding:      '8px 16px',
          display:      'flex',
          alignItems:   'center',
          gap:          12,
          boxShadow:    '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          {/* Distance */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>
              {distance !== null ? `${distance}m` : '---'}
            </div>
            <div style={{ fontSize: 10, color: '#64748B' }}>apart</div>
          </div>

          <div style={{ width: 1, height: 30, background: '#334155' }} />

          {/* Direction */}
          {dir && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>{dir.emoji}</span>
              <span style={{ fontSize: 12, color: dir.color, fontWeight: 600 }}>
                {dir.text}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}