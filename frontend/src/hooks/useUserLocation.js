import { useState, useEffect, useRef } from 'react'

const OOU_MAIN_GATE = { lat: 6.9115, lng: 3.8693 }

export default function useUserLocation() {
  const [location,  setLocation]  = useState(null)
  const [accuracy,  setAccuracy]  = useState(null)
  const [error,     setError]     = useState(null)
  const [loading,   setLoading]   = useState(true)
  const watchIdRef  = useRef(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('GPS not supported — using Main Gate as start point')
      setLocation(OOU_MAIN_GATE)
      setLoading(false)
      return
    }

    // watchPosition fires every time user moves
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setAccuracy(Math.round(position.coords.accuracy))
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.warn('GPS error:', err.message)
        setError('GPS unavailable — using Main Gate as start point')
        setLocation(OOU_MAIN_GATE)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout:            10000,
        maximumAge:         0,
      }
    )

    // Stop watching when component unmounts
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return { location, accuracy, error, loading }
}