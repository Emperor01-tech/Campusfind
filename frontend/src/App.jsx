import { useState }      from 'react'
import { Routes, Route } from 'react-router-dom'
import Map               from './components/Map'
import SearchBar         from './components/SearchBar'
import ShareButton       from './components/ShareButton'
import GPSStatusBar      from './components/GPSStatusBar'
import MeetPage          from './pages/MeetPage'
import AdminLogin        from './pages/AdminLogin'
import AdminDashboard    from './pages/AdminDashboard'
import useUserLocation   from './hooks/useUserLocation'

function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [meetCode, setMeetCode]                 = useState(null)
  const {
    location: userLocation,
    accuracy,
    error:    gpsError,
    loading:  gpsLoading,
  } = useUserLocation()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <SearchBar  onSelect={setSelectedLocation} />
      <Map
        selectedLocation={selectedLocation}
        userLocation={userLocation}
        meetUsers={[]}
      />
      <ShareButton onSessionCreated={setMeetCode} />
      <GPSStatusBar
        accuracy={accuracy}
        error={gpsError}
        loading={gpsLoading}
      />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<HomePage />}      />
      <Route path="/meet/:code"      element={<MeetPage />}      />
      <Route path="/admin"           element={<AdminLogin />}    />
      <Route path="/admin/dashboard" element={<AdminDashboard />}/>
    </Routes>
  )
}