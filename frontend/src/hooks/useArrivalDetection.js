import { useState, useEffect, useRef } from 'react'

// Distance in metres between two GPS points
function haversine(lat1, lng1, lat2, lng2) {
  const R  = 6371e3
  const f1 = lat1 * Math.PI / 180
  const f2 = lat2 * Math.PI / 180
  const df = (lat2 - lat1) * Math.PI / 180
  const dl = (lng2 - lng1) * Math.PI / 180
  const a  = Math.sin(df / 2) ** 2 + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// How close (in metres) counts as "arrived"
const ARRIVAL_RADIUS = 20

export default function useArrivalDetection(userLocation, destination) {
  const [arrived,      setArrived]      = useState(false)
  const [arrivedAt,    setArrivedAt]    = useState(null)
  const [distance,     setDistance]     = useState(null)
  const lastDestRef = useRef(null)

  // Reset arrival state whenever a new destination is picked
  useEffect(() => {
    if (destination?.id !== lastDestRef.current?.id) {
      setArrived(false)
      setArrivedAt(null)
      lastDestRef.current = destination
    }
  }, [destination])

  useEffect(() => {
    if (!userLocation || !destination) {
      setDistance(null)
      return
    }

    const d = haversine(
      userLocation.lat, userLocation.lng,
      destination.lat,  destination.lng
    )
    setDistance(Math.round(d))

    if (d <= ARRIVAL_RADIUS && !arrived) {
      setArrived(true)
      setArrivedAt(destination)
    }
  }, [userLocation, destination, arrived])

  function dismissArrival() {
    setArrived(false)
  }

  return { arrived, arrivedAt, distance, dismissArrival }
}