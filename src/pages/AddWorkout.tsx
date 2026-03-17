import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { addWorkout } from '../lib/storage'
import { generateId, todayISO } from '../lib/data'
import { loadUser } from '../lib/storage'
import LiftInputGroup from '../components/LiftInputGroup'
import type { UserRole } from '../types'

export default function AddWorkout() {
  const navigate = useNavigate()
  const [date, setDate] = useState(todayISO())
  const [squatVol, setSquatVol]     = useState('1x5')
  const [squatWt,  setSquatWt]      = useState('')
  const [pressVol, setPressVol]     = useState('1x5')
  const [pressWt,  setPressWt]      = useState('')
  const [dlVol,    setDlVol]        = useState('1x5')
  const [dlWt,     setDlWt]         = useState('')
  const [saved,    setSaved]        = useState(false)
  const [error,    setError]        = useState('')

  function handleSave() {
    setError('')
    if (!date) { setError('Please select a date'); return }

    const sqWt = squatWt ? parseFloat(squatWt) : null
    const prWt = pressWt ? parseFloat(pressWt) : null
    const dlWtN = dlWt ? parseFloat(dlWt)   : null

    if (sqWt !== null && isNaN(sqWt)) { setError('Squat weight must be a number'); return }
    if (prWt !== null && isNaN(prWt)) { setError('Press weight must be a number'); return }
    if (dlWtN !== null && isNaN(dlWtN)) { setError('Deadlift weight must be a number'); return }

    const role = (loadUser() as UserRole) || 'athlete'

    addWorkout({
      id:              generateId(),
      date,
      squatVolume:     squatVol,
      squatWeight:     sqWt,
      pressVolume:     pressVol,
      pressWeight:     prWt,
      deadliftVolume:  dlVol,
      deadliftWeight:  dlWtN,
      createdBy:       role,
      createdAt:       new Date().toISOString(),
    })

    setSaved(true)
    setTimeout(() => navigate('/app'), 1200)
  }

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-stone-900 mb-5">Log Workout</h1>

      {/* Date */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white transition"
        />
      </div>

      {/* Lifts */}
      <div className="flex flex-col gap-3 mb-5">
        <LiftInputGroup lift="Squat"    volume={squatVol} weight={squatWt} onVolumeChange={setSquatVol} onWeightChange={setSquatWt} />
        <LiftInputGroup lift="Press"    volume={pressVol} weight={pressWt} onVolumeChange={setPressVol} onWeightChange={setPressWt} />
        <LiftInputGroup lift="Deadlift" volume={dlVol}    weight={dlWt}    onVolumeChange={setDlVol}    onWeightChange={setDlWt}    />
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {saved ? (
        <div className="flex items-center gap-2 justify-center bg-green-50 border border-green-200 rounded-2xl py-3 text-green-700 text-sm font-medium">
          <CheckCircle size={18} />
          Workout saved! Redirecting…
        </div>
      ) : (
        <button
          onClick={handleSave}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-2xl text-sm transition-colors"
        >
          Save Workout
        </button>
      )}
    </div>
  )
}
