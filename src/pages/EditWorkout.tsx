import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Trash2, CheckCircle } from 'lucide-react'
import { useWorkouts } from '../hooks/useWorkouts'
import LiftInputGroup from '../components/LiftInputGroup'
import type { WorkoutEntry } from '../types'

export default function EditWorkout() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { workouts, update, remove } = useWorkouts()

  const [entry,    setEntry]    = useState<WorkoutEntry | null>(null)
  const [date,     setDate]     = useState('')
  const [squatVol, setSquatVol] = useState('')
  const [squatWt,  setSquatWt]  = useState('')
  const [pressVol, setPressVol] = useState('')
  const [pressWt,  setPressWt]  = useState('')
  const [dlVol,    setDlVol]    = useState('')
  const [dlWt,     setDlWt]     = useState('')
  const [saved,    setSaved]    = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const found = workouts.find(e => e.id === id) ?? null
    if (found) {
      setEntry(found)
      setDate(found.date)
      setSquatVol(found.squatVolume || '')
      setSquatWt(found.squatWeight?.toString() || '')
      setPressVol(found.pressVolume || '')
      setPressWt(found.pressWeight?.toString() || '')
      setDlVol(found.deadliftVolume || '')
      setDlWt(found.deadliftWeight?.toString() || '')
    }
  }, [id, workouts])

  if (!entry) {
    return <div className="px-4 py-10 text-center text-stone-500 text-sm">Entry not found</div>
  }

  async function handleSave() {
    setError('')
    if (!date) { setError('Please select a date'); return }

    const sqWt  = squatWt ? parseFloat(squatWt) : null
    const prWt  = pressWt ? parseFloat(pressWt) : null
    const dlWtN = dlWt    ? parseFloat(dlWt)    : null

    setSaving(true)
    await update({
      ...entry!,
      date,
      squatVolume:    squatVol,
      squatWeight:    sqWt,
      pressVolume:    pressVol,
      pressWeight:    prWt,
      deadliftVolume: dlVol,
      deadliftWeight: dlWtN,
    })

    setSaved(true)
    setTimeout(() => navigate('/app/history'), 1000)
  }

  async function handleDelete() {
    await remove(entry!.id)
    navigate('/app/history')
  }

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-stone-900">Edit Workout</h1>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      {/* Date */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-stone-500 mb-1.5 uppercase tracking-wide">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white transition"
        />
      </div>

      <div className="flex flex-col gap-3 mb-5">
        <LiftInputGroup lift="Squat"    volume={squatVol} weight={squatWt} onVolumeChange={setSquatVol} onWeightChange={setSquatWt} />
        <LiftInputGroup lift="Press"    volume={pressVol} weight={pressWt} onVolumeChange={setPressVol} onWeightChange={setPressWt} />
        <LiftInputGroup lift="Deadlift" volume={dlVol}    weight={dlWt}    onVolumeChange={setDlVol}    onWeightChange={setDlWt}    />
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {saved ? (
        <div className="flex items-center gap-2 justify-center bg-green-50 border border-green-200 rounded-2xl py-3 text-green-700 text-sm font-medium">
          <CheckCircle size={18} />
          Saved! Redirecting…
        </div>
      ) : (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-3 rounded-2xl text-sm transition-colors"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      )}

      {/* Delete confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl p-6 w-full max-w-lg">
            <h3 className="text-base font-semibold text-stone-900 mb-1">Delete workout?</h3>
            <p className="text-sm text-stone-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
