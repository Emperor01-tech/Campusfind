import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

export default function useMeetSession(code, userLocation) {
  const [otherUsers,    setOtherUsers]    = useState([])
  const [distance,      setDistance]      = useState(null)
  const [prevDistance,  setPrevDistance]  = useState(null)
  const [connected,     setConnected]     = useState(false)
  const [friendJoined,  setFriendJoined]  = useState(false)
  const socketRef  = useRef(null)
  const userIdRef  = useRef(`user_${Date.now()}`)

  // Direction — getting closer or moving away
  const direction = (() => {
    if (!distance || !prevDistance) return null
    const diff = distance - prevDistance
    if (Math.abs(diff) < 2) return 'same'
    return diff < 0 ? 'closer' : 'away'
  })()

  useEffect(() => {
    if (!code) return

    // Connect to Socket.IO
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] })

    socketRef.current.on('connect', () => {
      setConnected(true)
      socketRef.current.emit('join_session', {
        code,
        userId: userIdRef.current,
        name:   'Me',
      })
    })

    socketRef.current.on('user_joined', (data) => {
      if (data.userId !== userIdRef.current) {
        setFriendJoined(true)
      }
    })

    socketRef.current.on('locations_updated', (data) => {
      const others = data.users.filter(u => u.userId !== userIdRef.current)
      setOtherUsers(others)
      if (data.distance !== null) {
        setPrevDistance(prev => prev ?? data.distance)
        setDistance(d => {
          setPrevDistance(d)
          return data.distance
        })
      }
    })

    socketRef.current.on('user_left', () => {
      setFriendJoined(false)
      setOtherUsers([])
      setDistance(null)
    })

    return () => {
      socketRef.current?.emit('leave_session', {
        code,
        userId: userIdRef.current,
      })
      socketRef.current?.disconnect()
    }
  }, [code])

  // Send location every 3 seconds
  useEffect(() => {
    if (!code || !userLocation || !connected) return

    const interval = setInterval(() => {
      socketRef.current?.emit('location_update', {
        code,
        userId: userIdRef.current,
        lat:    userLocation.lat,
        lng:    userLocation.lng,
      })
    }, 3000)

    // Send immediately on first connect
    socketRef.current?.emit('location_update', {
      code,
      userId: userIdRef.current,
      lat:    userLocation.lat,
      lng:    userLocation.lng,
    })

    return () => clearInterval(interval)
  }, [code, userLocation, connected])

  return {
    otherUsers,
    distance,
    direction,
    connected,
    friendJoined,
    myUserId: userIdRef.current,
  }
}