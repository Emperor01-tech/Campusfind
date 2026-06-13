import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const OSRM = 'https://router.project-osrm.org/route/v1/foot'

async function fetchRoute(from, to) {
  const url  = `${OSRM}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
  const res  = await fetch(url)
  const data = await res.json()
  if (data.code !== 'Ok' || !data.routes.length) return null
  return {
    coords:   data.routes[0].geometry.coordinates,
    distance: data.routes[0].distance,
    duration: data.routes[0].duration,
  }
}

export default function RoutingLine({ from, to }) {
  const map          = useMap()
  const glowRef      = useRef(null)
  const lineRef      = useRef(null)
  const dotRef       = useRef(null)
  const fromDotRef   = useRef(null)
  const animRef      = useRef(null)
  const intervalRef  = useRef(null)
  const routeRef     = useRef(null)
  const progressRef  = useRef(0)
  const infoRef      = useRef(null)
  const firstDrawRef = useRef(true)  // ← tracks first draw only

  function drawRoute(coords, distance, duration) {
    const points = coords.map(c => [c[1], c[0]])
    routeRef.current = points

    if (glowRef.current)    glowRef.current.remove()
    if (lineRef.current)    lineRef.current.remove()
    if (fromDotRef.current) fromDotRef.current.remove()
    if (infoRef.current)    infoRef.current.remove()

    // Glow layer
    glowRef.current = L.polyline(points, {
      color:   '#00FF88',
      weight:  14,
      opacity: 0.12,
      lineCap: 'round',
    }).addTo(map)

    // Main green line
    lineRef.current = L.polyline(points, {
      color:     '#00D26A',
      weight:    5,
      opacity:   0.95,
      dashArray: '12 6',
      lineCap:   'round',
      lineJoin:  'round',
    }).addTo(map)

    // You are here dot
    fromDotRef.current = L.circleMarker(points[0], {
      radius:      9,
      color:       'white',
      fillColor:   '#3B82F6',
      fillOpacity: 1,
      weight:      3,
    }).addTo(map).bindTooltip('📍 You are here', {
      permanent:  false,
      direction:  'top',
    })

    // Distance + time bubble
    const mins = Math.ceil(duration / 60)
    const dist = distance >= 1000
      ? `${(distance / 1000).toFixed(1)}km`
      : `${Math.round(distance)}m`

    infoRef.current = L.marker(points[points.length - 1], {
      icon: L.divIcon({
        className: '',
        html: `
          <div style="
            background:#00D26A;
            color:#0B1120;
            font-weight:700;
            font-size:11px;
            padding:4px 10px;
            border-radius:99px;
            white-space:nowrap;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
          ">
            📍 ${dist} · ~${mins} min walk
          </div>`,
        iconAnchor: [40, 40],
      }),
      zIndexOffset: 1000,
    }).addTo(map)

    // Only fit bounds on very first draw — never interrupt user zooming after
    if (firstDrawRef.current) {
      map.fitBounds(
        L.latLngBounds(points).pad(0.25),
        { animate: true, duration: 1 }
      )
      firstDrawRef.current = false
    }
  }

  function startAnimation() {
    if (animRef.current) clearInterval(animRef.current)

    const movingIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          width:14px; height:14px;
          background:#00D26A;
          border-radius:50%;
          border:3px solid white;
          box-shadow:0 0 12px #00D26A;
        "></div>`,
      iconSize:   [14, 14],
      iconAnchor: [7, 7],
    })

    if (!dotRef.current) {
      dotRef.current = L.marker([0, 0], {
        icon:         movingIcon,
        zIndexOffset: 950,
      }).addTo(map)
    }

    animRef.current = setInterval(() => {
      const route = routeRef.current
      if (!route || route.length < 2) return

      progressRef.current += 0.008
      if (progressRef.current > 1) progressRef.current = 0

      const totalSegments = route.length - 1
      const exact         = progressRef.current * totalSegments
      const segIndex      = Math.floor(exact)
      const segProgress   = exact - segIndex

      if (segIndex >= totalSegments) return

      const p1      = route[segIndex]
      const p2      = route[segIndex + 1]
      const lerpLat = p1[0] + (p2[0] - p1[0]) * segProgress
      const lerpLng = p1[1] + (p2[1] - p1[1]) * segProgress

      dotRef.current.setLatLng([lerpLat, lerpLng])
    }, 50)
  }

  async function loadRoute() {
    if (!from || !to) return
    try {
      const result = await fetchRoute(from, to)
      if (!result) return
      drawRoute(result.coords, result.distance, result.duration)
      if (!dotRef.current) startAnimation()
    } catch (err) {
      console.warn('Route fetch failed:', err)
    }
  }

  useEffect(() => {
    if (!from || !to) return

    // Reset first draw flag when destination changes
    firstDrawRef.current = true
    progressRef.current  = 0

    loadRoute()

    // Update every 3 seconds as user moves
    intervalRef.current = setInterval(loadRoute, 3000)

    return () => {
      if (glowRef.current)     glowRef.current.remove()
      if (lineRef.current)     lineRef.current.remove()
      if (dotRef.current)      { dotRef.current.remove(); dotRef.current = null }
      if (fromDotRef.current)  fromDotRef.current.remove()
      if (infoRef.current)     infoRef.current.remove()
      if (animRef.current)     clearInterval(animRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [from?.lat, from?.lng, to?.lat, to?.lng])

  return null
}