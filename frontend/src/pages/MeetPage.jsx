import { useParams }       from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios               from 'axios'
import Map                 from '../components/Map'
import MeetStatusBar       from '../components/MeetStatusBar'
import GPSStatusBar        from '../components/GPSStatusBar'
import useUserLocation     from '../hooks/useUserLocation'
import useMeetSession      from '../hooks/useMeetSession'

export default function MeetPage() {
  const { code }   = useParams()
  const [valid,    setValid]    = useState(null)
  const [checking, setChecking] = useState(true)

  const { location: userLocation, accuracy, error: gpsError, loading: gpsLoading } = useUserLocation()
  const { otherUsers, distance, direction, connected, friendJoined } = useMeetSession(code, userLocation)

  // Verify the session code is valid
  useEffect(() => {
    axios.get(`http://localhost:5000/api/meet/${code}`)
      .then(res => { setValid(res.data.valid); setChecking(false) })
      .catch(()  => { setValid(false);          setChecking(false) })
  }, [code])

  if (checking) return (
    <div style={centeredStyle}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🗺️</div>
      <div style={{ fontWeight: 700, fontSize: 16 }}>Opening CampusFind...</div>
    </div>
  )

  if (!valid) return (
    <div style={centeredStyle}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>❌</div>
      <div style={{ fontWeight: 700, fontSize: 16, color: '#EF4444' }}>
        Session not found
      </div>
      <div style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>
        This link may have expired. Ask your friend to share a new one.
      </div>
    </div>
  )

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>

      {/* Session header */}
      <div style={{
        position:   'absolute',
        top:        0, left: 0, right: 0,
        zIndex:     1000,
        background: '#1E293Bee',
        padding:    '10px 16px',
        display:    'flex',
        alignItems: 'center',
        gap:        10,
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ fontSize: 20 }}>📍</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>
            Live Meet Session
          </div>
          <div style={{ fontSize: 11, color: '#64748B' }}>
            Code: <span style={{ color: '#00D26A', fontWeight: 700 }}>{code}</span>
          </div>
        </div>
        <div style={{
          marginLeft:   'auto',
          background:   connected ? '#00D26A20' : '#EF444420',
          border:       `1px solid ${connected ? '#00D26A' : '#EF4444'}55`,
          borderRadius: 99,
          padding:      '3px 10px',
          fontSize:     11,
          color:        connected ? '#00D26A' : '#EF4444',
          fontWeight:   700,
        }}>
          {connected ? '🟢 Connected' : '🔴 Connecting...'}
        </div>
      </div>

      {/* Meet status — distance and direction */}
      <div style={{ marginTop: 52 }}>
        <MeetStatusBar
          distance={distance}
          direction={direction}
          friendJoined={friendJoined}
          connected={connected}
        />
      </div>

      {/* Map with friend markers */}
      <Map
        selectedLocation={null}
        userLocation={userLocation}
        meetUsers={otherUsers}
      />

      {/* GPS status */}
      <GPSStatusBar
        accuracy={accuracy}
        error={gpsError}
        loading={gpsLoading}
      />

    </div>
  )
}

const centeredStyle = {
  width:          '100vw',
  height:         '100vh',
  display:        'flex',
  flexDirection:  'column',
  alignItems:     'center',
  justifyContent: 'center',
  background:     '#0B1120',
  color:          'white',
  fontFamily:     'Segoe UI, sans-serif',
  textAlign:      'center',
  padding:        20,
}