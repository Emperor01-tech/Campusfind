import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export default function MapController({ selected }) {
  const map      = useMap()
  const markerRef = useRef(null)

  useEffect(() => {
    if (!selected) return

    // Fly smoothly to selected location
    map.flyTo([selected.lat, selected.lng], 19, {
      animate:  true,
      duration: 1.2,
    })

    // Remove previous temporary marker if any
    if (markerRef.current) {
      markerRef.current.remove()
    }

    // Create a pulsing destination marker
    const pulseIcon = L.divIcon({
      className: '',
      html: `
        <div style="position:relative; width:40px; height:40px;">
          <div style="
            position:absolute; inset:0;
            background:${selected.color || '#00D26A'};
            border-radius:50%;
            animation:pulse 1.5s ease-out infinite;
            opacity:0.4;
          "></div>
          <div style="
            position:absolute; inset:6px;
            background:${selected.color || '#00D26A'};
            border-radius:50%;
            border:2px solid white;
            display:flex; align-items:center; justify-content:center;
            font-size:14px;
          ">${selected.icon || '📍'}</div>
        </div>
        <style>
          @keyframes pulse {
            0%   { transform: scale(1);   opacity: 0.4; }
            100% { transform: scale(2.5); opacity: 0;   }
          }
        </style>
      `,
      iconSize:    [40, 40],
      iconAnchor:  [20, 20],
      popupAnchor: [0, -20],
    })

    // Place pulsing marker and open popup
    const marker = L.marker([selected.lat, selected.lng], { icon: pulseIcon })
      .addTo(map)
      .bindPopup(`
        <div style="min-width:180px">
          <div style="font-size:15px; font-weight:700; margin-bottom:4px">
            ${selected.icon} ${selected.name}
          </div>
          <div style="font-size:12px; color:#555; margin-bottom:4px">
            ${selected.description || ''}
          </div>
          ${selected.room ? `
            <div style="font-size:12px; color:#888">
              📍 ${selected.building} · ${selected.room}
            </div>` : ''}
          <div style="
            margin-top:8px; display:inline-block;
            background:${selected.color || '#6B7280'}22;
            border:1px solid ${selected.color || '#6B7280'};
            border-radius:99px; padding:2px 10px;
            font-size:11px; color:${selected.color || '#6B7280'};
            font-weight:600; text-transform:capitalize;
          ">${selected.category}</div>
        </div>
      `)

    setTimeout(() => marker.openPopup(), 1200)
    markerRef.current = marker

    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
      }
    }
  }, [selected, map])

  return null
}