import { useState } from 'react'
import { useMap }   from 'react-leaflet'

export default function CenterButton({ location }) {
  const map       = useMap()
  const [active, setActive] = useState(false)

  function handleCenter() {
    if (!location) return
    setActive(true)
    map.flyTo([location.lat, location.lng], 18, {
      animate:  true,
      duration: 1.2,
    })
    setTimeout(() => setActive(false), 1500)
  }

  return (
    <div
      onClick={handleCenter}
      title="Center on my location"
      style={{
        position:       'absolute',
        bottom:         90,
        right:          16,
        zIndex:         1000,
        width:          44,
        height:         44,
        background:     active ? '#3B82F6' : 'white',
        borderRadius:   12,
        boxShadow:      '0 2px 12px rgba(0,0,0,0.2)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        cursor:         'pointer',
        fontSize:       20,
        transition:     'all 0.2s',
        border:         '2px solid #E2E8F0',
      }}
    >
      {active ? '✓' : '🎯'}
    </div>
  )
}