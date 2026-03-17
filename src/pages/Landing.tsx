import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Trophy, Upload, ChevronRight } from 'lucide-react'

// Intersection Observer for scroll animations
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.15 }
    )
    const children = el.querySelectorAll('.fade-in-up')
    children.forEach(c => obs.observe(c))
    return () => obs.disconnect()
  }, [])
  return ref
}

// Hero phone SVG mockup
function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-center">
      <svg
        width="280"
        height="540"
        viewBox="0 0 280 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xl"
      >
        {/* Phone body */}
        <rect x="4" y="4" width="272" height="532" rx="38" fill="#1c1917" />
        <rect x="8" y="8" width="264" height="524" rx="35" fill="#fafaf9" />

        {/* Status bar */}
        <rect x="8" y="8" width="264" height="44" rx="35" fill="#fafaf9" />
        <rect x="8" y="38" width="264" height="14" fill="#fafaf9" />
        <text x="30" y="30" fontSize="11" fill="#78716c" fontFamily="Inter, sans-serif" fontWeight="500">9:41</text>
        <circle cx="250" cy="26" r="6" fill="#d6d3d1" />
        <circle cx="234" cy="26" r="6" fill="#d6d3d1" />
        <circle cx="218" cy="26" r="6" fill="#d6d3d1" />

        {/* Notch */}
        <rect x="100" y="8" width="80" height="24" rx="12" fill="#1c1917" />

        {/* App header */}
        <rect x="8" y="52" width="264" height="44" fill="white" />
        <text x="26" y="79" fontSize="14" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="600">Puppier</text>
        <rect x="8" y="95" width="264" height="1" fill="#e7e5e4" />

        {/* Dashboard title */}
        <text x="26" y="124" fontSize="13" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="700">Dashboard</text>
        <text x="26" y="140" fontSize="9" fill="#a8a29e" fontFamily="Inter, sans-serif">Your training at a glance</text>

        {/* PR section label */}
        <text x="26" y="162" fontSize="8" fill="#78716c" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.08em">PERSONAL RECORDS (1x5)</text>

        {/* PR cards */}
        {/* Squat */}
        <rect x="26" y="170" width="68" height="52" rx="10" fill="white" stroke="#e7e5e4" strokeWidth="1" />
        <text x="34" y="184" fontSize="7.5" fill="#78716c" fontFamily="Inter, sans-serif" fontWeight="500">Squat</text>
        <text x="34" y="200" fontSize="18" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="700">140</text>
        <text x="60" y="200" fontSize="8" fill="#a8a29e" fontFamily="Inter, sans-serif">kg</text>

        {/* Press */}
        <rect x="102" y="170" width="68" height="52" rx="10" fill="white" stroke="#e7e5e4" strokeWidth="1" />
        <text x="110" y="184" fontSize="7.5" fill="#78716c" fontFamily="Inter, sans-serif" fontWeight="500">Press</text>
        <text x="110" y="200" fontSize="18" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="700">75</text>
        <text x="130" y="200" fontSize="8" fill="#a8a29e" fontFamily="Inter, sans-serif">kg</text>

        {/* Deadlift */}
        <rect x="178" y="170" width="68" height="52" rx="10" fill="white" stroke="#e7e5e4" strokeWidth="1" />
        <text x="186" y="184" fontSize="7.5" fill="#78716c" fontFamily="Inter, sans-serif" fontWeight="500">Deadlift</text>
        <text x="186" y="200" fontSize="18" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="700">180</text>
        <text x="212" y="200" fontSize="8" fill="#a8a29e" fontFamily="Inter, sans-serif">kg</text>

        {/* Latest workout label */}
        <text x="26" y="244" fontSize="8" fill="#78716c" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="0.08em">LATEST WORKOUT</text>

        {/* Workout card */}
        <rect x="26" y="252" width="220" height="72" rx="10" fill="white" stroke="#e7e5e4" strokeWidth="1" />
        <text x="38" y="268" fontSize="9" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="600">Mon, Jan 15 2024</text>
        <text x="180" y="268" fontSize="8" fill="#d97706" fontFamily="Inter, sans-serif" fontWeight="500">Edit</text>
        {/* Lift row */}
        <text x="38" y="286" fontSize="8" fill="#a8a29e" fontFamily="Inter, sans-serif">Squat</text>
        <text x="38" y="298" fontSize="10" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="600">140 kg</text>
        <text x="38" y="308" fontSize="7" fill="#a8a29e" fontFamily="Inter, sans-serif">1x5</text>
        <text x="110" y="286" fontSize="8" fill="#a8a29e" fontFamily="Inter, sans-serif">Press</text>
        <text x="110" y="298" fontSize="10" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="600">75 kg</text>
        <text x="110" y="308" fontSize="7" fill="#a8a29e" fontFamily="Inter, sans-serif">1x5</text>
        <text x="182" y="286" fontSize="8" fill="#a8a29e" fontFamily="Inter, sans-serif">Deadlift</text>
        <text x="182" y="298" fontSize="10" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="600">180 kg</text>
        <text x="182" y="308" fontSize="7" fill="#a8a29e" fontFamily="Inter, sans-serif">1x5</text>

        {/* Progress chart area */}
        <rect x="26" y="340" width="220" height="90" rx="10" fill="white" stroke="#e7e5e4" strokeWidth="1" />
        <text x="38" y="358" fontSize="9" fill="#1c1917" fontFamily="Inter, sans-serif" fontWeight="600">Squat Progress</text>
        <text x="38" y="370" fontSize="7" fill="#a8a29e" fontFamily="Inter, sans-serif">Weight · 1x5 entries only</text>
        {/* Chart line */}
        <polyline
          points="46,410 78,402 110,395 142,388 174,378 206,370 230,360"
          stroke="#d97706"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[46,78,110,142,174,206,230].map((x, i) => {
          const ys = [410,402,395,388,378,370,360]
          return <circle key={i} cx={x} cy={ys[i]} r="3" fill="#d97706" />
        })}
        {/* X axis labels */}
        <text x="40"  y="425" fontSize="6.5" fill="#a8a29e" fontFamily="Inter, sans-serif">Oct</text>
        <text x="100" y="425" fontSize="6.5" fill="#a8a29e" fontFamily="Inter, sans-serif">Nov</text>
        <text x="163" y="425" fontSize="6.5" fill="#a8a29e" fontFamily="Inter, sans-serif">Dec</text>
        <text x="220" y="425" fontSize="6.5" fill="#a8a29e" fontFamily="Inter, sans-serif">Jan</text>

        {/* Bottom nav */}
        <rect x="8" y="470" width="264" height="62" fill="white" />
        <rect x="8" y="470" width="264" height="1" fill="#e7e5e4" />
        {/* Nav icons placeholder dots */}
        {[50, 98, 140, 190, 234].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={490} r="7" fill={i === 0 ? '#d97706' : '#e7e5e4'} />
            <rect x={x - 12} y={500} width="24" height="4" rx="2" fill={i === 0 ? '#fde68a' : '#f5f5f4'} />
          </g>
        ))}

        {/* Scan corners */}
        <path d="M20 20 L20 44 M20 20 L44 20" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M260 20 L236 20 M260 20 L260 44" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 520 L20 496 M20 520 L44 520" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M260 520 L236 520 M260 520 L260 496" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />

        {/* Animated scan line */}
        <line x1="20" y1="52" x2="260" y2="52" stroke="#d97706" strokeWidth="1.5" opacity="0.7" className="scan-line" />
      </svg>

      {/* Floating result card */}
      <div className="absolute -right-4 top-32 bg-white rounded-2xl border border-stone-200 shadow-lg px-4 py-3 min-w-[130px]">
        <div className="text-xs text-stone-500 mb-1">New PR</div>
        <div className="flex items-end gap-1">
          <span className="text-xl font-bold text-stone-900">180</span>
          <span className="text-xs text-stone-400 pb-0.5">kg Deadlift</span>
        </div>
        <div className="mt-2 h-1.5 bg-stone-100 rounded-full">
          <div className="h-full w-4/5 bg-amber-500 rounded-full" />
        </div>
        <div className="text-xs text-amber-600 font-medium mt-1">+5kg vs last</div>
      </div>
    </div>
  )
}

// Landing page
export default function Landing() {
  const featuresRef     = useScrollReveal()
  const howItWorksRef   = useScrollReveal()
  const testimonialsRef = useScrollReveal()

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Nav */}
      <nav className="border-b border-stone-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <span className="font-bold text-stone-900 text-lg tracking-tight">Puppier</span>
        <Link
          to="/login"
          className="bg-stone-900 hover:bg-stone-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Open App
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Left: text */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-xs font-medium text-amber-700 mb-5">
              <Trophy size={12} />
              Track Squat · Press · Deadlift
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight mb-4">
              Simple tracking for serious lifting
            </h1>
            <p className="text-base text-stone-500 mb-8 leading-relaxed">
              Log every session, monitor your 1x5 progress, and see your personal records grow. Built for athletes and coaches who care about the numbers.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
              >
                Start Tracking
                <ChevronRight size={16} />
              </Link>
              <a
                href="#features"
                className="flex items-center justify-center gap-2 border border-stone-200 hover:border-stone-300 text-stone-700 font-medium px-5 py-3 rounded-xl transition-colors text-sm"
              >
                Learn more
              </a>
            </div>

            {/* Store buttons */}
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-stone-900 text-white rounded-xl px-4 py-2.5 text-xs font-medium cursor-not-allowed opacity-60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </div>
              <div className="flex items-center gap-2 bg-stone-900 text-white rounded-xl px-4 py-2.5 text-xs font-medium cursor-not-allowed opacity-60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l12.5-7.22-2.64-2.63-10.85 9.65zM.93 1.23C.57 1.6.36 2.17.36 2.9v18.2c0 .73.21 1.3.58 1.68l.08.08 10.2-10.2v-.24L1.01 1.15l-.08.08zm19.4 9.03l-2.88-1.66-2.88 1.66 2.88 2.88 2.88-2.88zm-6.76 3.68L3.18.24c-.35-.04-.69.03-.99.2L13.57 12l-.65 1.94z"/>
                </svg>
                Google Play
              </div>
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="flex-1 flex justify-center md:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-stone-50 border-y border-stone-100 py-16 px-6">
        <div ref={howItWorksRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">How it works</h2>
            <p className="text-stone-500 text-sm">Three steps to your best lifts</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Log your session', desc: 'Enter date, volume, and weight for each lift. Takes under 30 seconds.' },
              { step: '2', title: 'Track 1x5 progress', desc: 'The app automatically filters qualifying 1x5 entries for clean progress data.' },
              { step: '3', title: 'Break records', desc: 'Watch your PRs grow on the Records screen. Share with your coach for accountability.' },
            ].map(item => (
              <div key={item.step} className="fade-in-up bg-white rounded-2xl border border-stone-200 p-6">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-stone-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6">
        <div ref={featuresRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Everything you need</h2>
            <p className="text-stone-500 text-sm">Nothing you don't</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <TrendingUp size={18} />, title: 'Progress charts', desc: '1x5 qualifying entries only, highest weight per date. Honest data.' },
              { icon: <Trophy size={18} />, title: 'Personal records', desc: 'See your all-time best for Squat, Press, and Deadlift at a glance.' },
              { icon: <Upload size={18} />, title: 'CSV import', desc: 'Import your existing Google Sheets log in seconds. No manual re-entry.' },
              { icon: <ChevronRight size={18} />, title: 'Coach collaboration', desc: 'Athlete and Instructor profiles share the same log. Simple and practical.' },
              { icon: <TrendingUp size={18} />, title: 'Full history', desc: 'Every session saved. Non-qualifying entries stored but excluded from charts.' },
              { icon: <Trophy size={18} />, title: 'Works offline', desc: 'Progressive Web App. Install on any device. No internet required to log.' },
            ].map((f, i) => (
              <div key={i} className="fade-in-up bg-white border border-stone-200 rounded-2xl p-5 hover:border-amber-200 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 mb-3">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-stone-900 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-stone-50 border-y border-stone-100 py-16 px-6">
        <div ref={testimonialsRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">What athletes say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'Daniel R.', role: 'Powerlifter', text: 'Finally a log that only shows what matters. My 1x5 progress is crystal clear.' },
              { name: 'Sarah M.', role: 'Strength Coach', text: "I can check my athlete's numbers and add notes from my own phone. Simple and clean." },
              { name: 'Tom K.', role: 'Recreational lifter', text: 'Imported 18 months of Google Sheets data in two minutes. Records updated instantly.' },
            ].map((t, i) => (
              <div key={i} className="fade-in-up bg-white rounded-2xl border border-stone-200 p-5">
                <p className="text-sm text-stone-600 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="text-xs font-semibold text-stone-900">{t.name}</div>
                  <div className="text-xs text-stone-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-stone-900 mb-3">Ready to start lifting?</h2>
          <p className="text-sm text-stone-500 mb-6">No sign-up. No subscription. Just open the app and start logging.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Open App
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 px-6 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-stone-900 text-sm">Puppier</span>
          <div className="flex gap-6 text-xs text-stone-400">
            <span>Squat. Press. Deadlift.</span>
            <span>Track what matters.</span>
          </div>
          <span className="text-xs text-stone-300">Built for heavy training</span>
        </div>
      </footer>
    </div>
  )
}
