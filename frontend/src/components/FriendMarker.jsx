import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export default function FriendMarker({ user }) {
  const map       = useMap()
  const markerRef = useRef(null)

  useEffect(() => {
    if (!user?.lat || !user?.lng) return

    const icon = L.divIcon({
      className: '',
      html: `
        <div style="position:relative;width:28px;height:28px;">
          <div style="
            position:absolute;inset:-6px;
            background:#F97316;border-radius:50%;
            opacity:0.2;
            animation:friendPulse 2s ease-out infinite;
          "></div>
          <div style="
            position:absolute;inset:4px;
            background:#F97316;border-radius:50%;
            border:3px solid white;
            box-shadow:0 2px 8px rgba(249,115,22,0.6);
            display:flex;align-items:center;
            justify-content:center;font-size:10px;
          ">👤</div>
        </div>
        <style>
          @keyframes friendPulse {
            0%   { transform:scale(1);   opacity:0.3; }
            50%  { transform:scale(1.8); opacity:0.1; }
            100% { transform:scale(1);   opacity:0.3; }
          }
        </style>
      `,
      iconSize:   [28, 28],
      iconAnchor: [14, 14],
    })

    if (!markerRef.current) {
      markerRef.current = L.marker([user.lat, user.lng], { icon, zIndexOffset: 800 })
        .addTo(map)
        .bindTooltip('👤 Your Friend', { permanent: false, direction: 'top' })
    } else {
      markerRef.current.setLatLng([user.lat, user.lng])
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
    }
  }, [user, map])

  return null
}