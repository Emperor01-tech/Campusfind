import { useState, useEffect } from 'react'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon   from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, TileLayer, LayersControl, Polygon, Marker, Popup } from 'react-leaflet'
import { fetchLocations } from '../api'
import MapController  from './MapController'
import RoutingLine    from './RoutingLine'
import LiveUserMarker from './LiveUserMarker'
import CenterButton   from './CenterButton'
import FriendMarker   from './FriendMarker'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
})

const CAMPUS_CENTER   = [6.921001461659691, 3.8693585842862017]
const CAMPUS_BOUNDARY = [
  [6.938404203021357, 3.854042959145043],
  [6.939137600184305, 3.8860290128339656],
  [6.913851809107045, 3.890569375233532],
  [6.911017992235637, 3.849178169319246],
]

function createCustomIcon(color, emoji) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${color};width:36px;height:36px;
        border-radius:50% 50% 50% 0;transform:rotate(-45deg);
        border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);
        display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);font-size:16px">${emoji}</span>
      </div>`,
    iconSize:    [36, 36],
    iconAnchor:  [18, 36],
    popupAnchor: [0, -40],
  })
}

export default function Map({ selectedLocation, userLocation, meetUsers = [] }) {
  const [locations, setLocations] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  useEffect(() => {
    fetchLocations()
      .then(res => {
        setLocations(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not connect to server.')
        setLoading(false)
      })
  }, [])

  return (
    <>
      {loading && (
        <div style={{
          position:   'absolute', inset: 0, background: '#ffffffcc',
          zIndex:     1000, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 16, fontWeight: 600, color: '#333',
        }}>
          🗺️ Loading OOU campus map...
        </div>
      )}

      {error && (
        <div style={{
          position:   'absolute', top: 10, left: '50%',
          transform:  'translateX(-50%)', zIndex: 1000,
          background: '#EF4444', color: 'white',
          padding:    '8px 20px', borderRadius: 8,
          fontSize:   13, fontWeight: 600,
        }}>
          ⚠️ {error}
        </div>
      )}

      <MapContainer
        center={CAMPUS_CENTER}
        zoom={16}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        {/* ── LAYER TOGGLE: Street vs Satellite ── */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="🗺️ Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="🛰️ Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Campus boundary */}
        <Polygon
          positions={CAMPUS_BOUNDARY}
          pathOptions={{
            color:       '#00D26A',
            fillColor:   '#00D26A',
            fillOpacity: 0.05,
            weight:      2,
            dashArray:   '8 4',
          }}
        />

        {/* All location markers */}
        {locations.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createCustomIcon(loc.color || '#6B7280', loc.icon || '📍')}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                  {loc.icon} {loc.name}
                </div>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
                  {loc.description}
                </div>
                {loc.room && (
                  <div style={{ fontSize: 12, color: '#888' }}>
                    📍 {loc.building} · {loc.room}
                  </div>
                )}
                <div style={{
                  marginTop:     8, display: 'inline-block',
                  background:    (loc.color || '#6B7280') + '22',
                  border:        `1px solid ${loc.color || '#6B7280'}`,
                  borderRadius:  99, padding: '2px 10px',
                  fontSize:      11, color: loc.color || '#6B7280',
                  fontWeight:    600, textTransform: 'capitalize',
                }}>
                  {loc.category}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <LiveUserMarker location={userLocation} accuracy={null} />
        )}

        {userLocation && (
          <CenterButton location={userLocation} />
        )}

        {meetUsers.map(user => (
          <FriendMarker key={user.userId} user={user} />
        ))}

        <MapController selected={selectedLocation} />

        {userLocation && selectedLocation && (
          <RoutingLine from={userLocation} to={selectedLocation} />
        )}

      </MapContainer>
    </>
  )
}