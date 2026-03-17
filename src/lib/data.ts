// Business logic: 1x5 filtering, records, progress data

import type { WorkoutEntry, LiftData, Records } from '../types'
import { loadWorkouts } from './storage'

// A "qualifying" entry has a volume of N sets × 5 reps, e.g. 1*5, 2*5, 3*5, 4*5, 1x5, 3x5 …
function isOneByFive(volume: string | null | undefined): boolean {
  if (!volume) return false
  // Match any "<number> * 5" or "<number> x 5" pattern (case-insensitive, optional spaces)
  return /^\d+\s*[x*]\s*5$/i.test(volume.trim())
}

type Lift = 'squat' | 'press' | 'deadlift'

interface LiftFields {
  volume: keyof WorkoutEntry
  weight: keyof WorkoutEntry
}

const LIFT_FIELDS: Record<Lift, LiftFields> = {
  squat:    { volume: 'squatVolume',    weight: 'squatWeight' },
  press:    { volume: 'pressVolume',    weight: 'pressWeight' },
  deadlift: { volume: 'deadliftVolume', weight: 'deadliftWeight' },
}

// Returns 1x5-qualifying entries for a lift, grouped by date -> highest weight per date
export function getProgressData(lift: Lift): LiftData[] {
  const entries = loadWorkouts()
  const { volume: vKey, weight: wKey } = LIFT_FIELDS[lift]

  // Filter: volume must be 1x5 and weight must exist
  const qualifying = entries.filter(e => {
    const vol = e[vKey] as string
    const wt  = e[wKey] as number | null
    return isOneByFive(vol) && wt !== null && wt > 0
  })

  // Group by date -> keep max weight
  const byDate: Record<string, number> = {}
  for (const e of qualifying) {
    const d = e.date
    const w = e[wKey] as number
    if (!(d in byDate) || w > byDate[d]) {
      byDate[d] = w
    }
  }

  // Sort ascending by date
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, weight]) => ({ date, weight }))
}

// Personal records: highest weight from 1x5 entries
export function getRecords(): Records {
  const squat    = getProgressData('squat')
  const press    = getProgressData('press')
  const deadlift = getProgressData('deadlift')

  const max = (data: LiftData[]) =>
    data.length > 0 ? Math.max(...data.map(d => d.weight)) : null

  return {
    squat:    max(squat),
    press:    max(press),
    deadlift: max(deadlift),
  }
}

// Records for a specific year (1x5 qualifying entries only)
export function getYearRecords(year: number): Records {
  const prefix = `${year}-`

  const filtered = (lift: Lift): LiftData[] =>
    getProgressData(lift).filter(d => d.date.startsWith(prefix))

  const max = (data: LiftData[]) =>
    data.length > 0 ? Math.max(...data.map(d => d.weight)) : null

  return {
    squat:    max(filtered('squat')),
    press:    max(filtered('press')),
    deadlift: max(filtered('deadlift')),
  }
}

// Date of a record value within a LiftData array
export function getRecordDate(data: LiftData[], value: number | null): string | null {
  if (value === null) return null
  const entry = data.find(d => d.weight === value)
  return entry ? entry.date : null
}

// Latest workout entry (most recent date)
export function getLatestWorkout(): WorkoutEntry | null {
  const all = loadWorkouts()
  if (all.length === 0) return null
  return all.slice().sort((a, b) => b.date.localeCompare(a.date))[0]
}

// All workouts sorted newest first (for history)
export function getAllWorkoutsSorted(): WorkoutEntry[] {
  return loadWorkouts().slice().sort((a, b) => b.date.localeCompare(a.date))
}

// Unique ID generator
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Format date for display: "Mon, Jan 15 2024"
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Format date short: "Jan 15"
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Today as YYYY-MM-DD
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
