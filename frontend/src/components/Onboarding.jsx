import { useState } from 'react'

const SLIDES = [
  {
    emoji: '🗺️',
    title: 'Welcome to CampusFind',
    text:  'Never get lost on OOU campus again. Find any office, faculty, or building in seconds.',
    color: '#00D26A',
  },
  {
    emoji: '🔍',
    title: 'Search Anything',
    text:  'Type a lecturer\'s name, department, or building. We\'ll show you exactly where it is.',
    color: '#3B82F6',
  },
  {
    emoji: '🟢',
    title: 'Follow the Green Path',
    text:  'Get real walking directions on actual campus roads — updated live as you move.',
    color: '#0EA5E9',
  },
  {
    emoji: '📲',
    title: 'Share Your Location',
    text:  'Send a live location link to a friend on WhatsApp and meet up easily on campus.',
    color: '#25D366',
  },
]

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0)
  const isLast = step === SLIDES.length - 1
  const slide  = SLIDES[step]

  function next() {
    if (isLast) {
      localStorage.setItem('campusfind_onboarded', 'true')
      onFinish()
    } else {
      setStep(s => s + 1)
    }
  }

  function skip() {
    localStorage.setItem('campusfind_onboarded', 'true')
    onFinish()
  }

  return (
    <div style={{
      position:   'fixed',
      inset:      0,
      zIndex:     3000,
      background: '#0B1120',
      display:    'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
    }}>

      {/* Skip button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 20px' }}>
        <button onClick={skip} style={{
          background: 'transparent', border: 'none',
          color: '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 32px', textAlign: 'center',
      }}>
        <div key={step} style={{
          animation: 'slideFade 0.4s ease',
        }}>
          <style>{`
            @keyframes slideFade {
              from { opacity: 0; transform: translateY(12px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Icon circle */}
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: `${slide.color}18`,
            border: `2px solid ${slide.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 50, margin: '0 auto 32px',
          }}>
            {slide.emoji}
          </div>

          <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 12 }}>
            {slide.title}
          </div>

          <div style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, maxWidth: 300 }}>
            {slide.text}
          </div>
        </div>
      </div>

      {/* Dots + Next button */}
      <div style={{ padding: '0 24px 36px' }}>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 22 : 7,
              height: 7,
              borderRadius: 99,
              background: i === step ? slide.color : '#334155',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        <button onClick={next} style={{
          width: '100%', padding: '14px',
          background: `linear-gradient(135deg, ${slide.color}, #0EA5E9)`,
          border: 'none', borderRadius: 14,
          color: 'white', fontWeight: 700, fontSize: 15,
          cursor: 'pointer',
          boxShadow: `0 8px 24px ${slide.color}44`,
        }}>
          {isLast ? "Let's Go! 🚀" : 'Next'}
        </button>
      </div>
    </div>
  )
}