import { useState }            from 'react'
import { Routes, Route }       from 'react-router-dom'
import Map                     from './components/Map'
import SearchBar                from './components/SearchBar'
import ShareButton              from './components/ShareButton'
import GPSStatusBar             from './components/GPSStatusBar'
import ArrivalBanner            from './components/ArrivalBanner'
import MeetPage                  from './pages/MeetPage'
import AdminLogin               from './pages/AdminLogin'
import AdminDashboard           from './pages/AdminDashboard'
import useUserLocation          from './hooks/useUserLocation'
import useArrivalDetection      from './hooks/useArrivalDetection'

function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [meetCode, setMeetCode]                  = useState(null)

  const {
    location: userLocation,
    accuracy,
    error:    gpsError,
    loading:  gpsLoading,
  } = useUserLocation()

  const { arrived, arrivedAt, dismissArrival } = useArrivalDetection(
    userLocation,
    selectedLocation
  )

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <SearchBar onSelect={setSelectedLocation} />

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

      {/* Arrival celebration popup */}
      <ArrivalBanner
        arrived={arrived}
        location={arrivedAt}
        onDismiss={dismissArrival}
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