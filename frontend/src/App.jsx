import { useState, useEffect }  from 'react'
import { Routes, Route }        from 'react-router-dom'
import Map                      from './components/Map'
import SearchBar                from './components/SearchBar'
import ShareButton              from './components/ShareButton'
import GPSStatusBar             from './components/GPSStatusBar'
import ArrivalBanner            from './components/ArrivalBanner'
import InstallPrompt            from './components/InstallPrompt'
import Onboarding               from './components/Onboarding'
import MeetPage                 from './pages/MeetPage'
import AdminLogin               from './pages/AdminLogin'
import AdminDashboard           from './pages/AdminDashboard'
import useUserLocation          from './hooks/useUserLocation'
import useArrivalDetection      from './hooks/useArrivalDetection'
import FeedbackWidget from './components/FeedbackWidget'
import AdminFeedback from './pages/AdminFeedback'

function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [meetCode, setMeetCode]                  = useState(null)
  const [showOnboarding, setShowOnboarding]      = useState(false)
  const [checkedOnboarding, setCheckedOnboarding] = useState(false)

  // Check on mount if user has seen onboarding before
  useEffect(() => {
    const seen = localStorage.getItem('campusfind_onboarded')
    if (!seen) setShowOnboarding(true)
    setCheckedOnboarding(true)
  }, [])

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

  // Don't render the map until we've checked onboarding status
  // prevents a flash of the map before the intro shows
  if (!checkedOnboarding) return null

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>

      {showOnboarding && (
        <Onboarding onFinish={() => setShowOnboarding(false)} />
      )}

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

      <ArrivalBanner
        arrived={arrived}
        location={arrivedAt}
        onDismiss={dismissArrival}
      />

      <InstallPrompt />
      <FeedbackWidget />
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
      <Route path="/admin/feedback" element={<AdminFeedback />} />
    </Routes>
  )
}