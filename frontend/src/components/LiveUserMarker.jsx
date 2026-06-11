import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export default function LiveUserMarker({ location, accuracy }) {
  const map           = useMap()
  const markerRef     = useRef(null)
  const accuracyRef   = useRef(null)
  const isFirstRef    = useRef(true)

  useEffect(() => {
    if (!location) return

    // Build the animated blue dot icon
    const icon = L.divIcon({
      className: '',
      html: `
        <div style="position:relative; width:28px; height:28px;">
          <!-- Outer pulse ring -->
          <div style="
            position:absolute; inset:-6px;
            background:#3B82F6;
            border-radius:50%;
            opacity:0.2;
            animation:livePulse 2s ease-out infinite;
          "></div>
          <!-- Inner solid dot -->
          <div style="
            position:absolute; inset:4px;
            background:#3B82F6;
            border-radius:50%;
            border:3px solid white;
            box-shadow:0 2px 8px rgba(59,130,246,0.6);
          "></div>
        </div>
        <style>
          @keyframes livePulse {
            0%   { transform:scale(1);   opacity:0.3; }
            50%  { transform:scale(1.8); opacity:0.1; }
            100% { transform:scale(1);   opacity:0.3; }
          }
        </style>
      `,
      iconSize:   [28, 28],
      iconAnchor: [14, 14],
    })

    // First load — create the marker
    if (!markerRef.current) {
      markerRef.current = L.marker([location.lat, location.lng], { icon, zIndexOffset: 900 })
        .addTo(map)
        .bindTooltip('📍 You are here', { permanent: false, direction: 'top' })
    } else {
      // Subsequent updates — smoothly move the marker
      markerRef.current.setLatLng([location.lat, location.lng])
    }

    // Draw accuracy circle around the dot
    if (accuracyRef.current) {
      accuracyRef.current.remove()
    }
    if (accuracy && accuracy < 100) {
      accuracyRef.current = L.circle([location.lat, location.lng], {
        radius:      accuracy,
        color:       '#3B82F6',
        fillColor:   '#3B82F6',
        fillOpacity: 0.08,
        weight:      1,
        dashArray:   '4 4',
      }).addTo(map)
    }

    // On very first GPS fix — fly to user position
    if (isFirstRef.current) {
      map.flyTo([location.lat, location.lng], 18, {
        animate:  true,
        duration: 1.5,
      })
      isFirstRef.current = false
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      if (accuracyRef.current) {
        accuracyRef.current.remove()
        accuracyRef.current = null
      }
    }
  }, [location, accuracy, map])

  return null
}