// Business logic: N×5 filtering, records, progress data
// All functions accept a WorkoutEntry[] so they work with any data source
// (Supabase, localStorage cache, test data, etc.)

import type { WorkoutEntry, LiftData, Records } from '../types'

// A "qualifying" entry has a volume of N sets × 5 reps: 1*5, 2*5, 3*5, 3x5 …
function isNByFive(volume: string | null | undefined): boolean {
  if (!volume) return false
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

// Returns N×5 qualifying entries for a lift, grouped by date → highest weight per date
export function getProgressData(lift: Lift, entries: WorkoutEntry[]): LiftData[] {
  const { volume: vKey, weight: wKey } = LIFT_FIELDS[lift]

  const qualifying = entries.filter(e => {
    const vol = e[vKey] as string
    const wt  = e[wKey] as number | null
    return isNByFive(vol) && wt !== null && wt > 0
  })

  // Group by date → keep max weight
  const byDate: Record<string, number> = {}
  for (const e of qualifying) {
    const d = e.date
    const w = e[wKey] as number
    if (!(d in byDate) || w > byDate[d]) byDate[d] = w
  }

  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, weight]) => ({ date, weight }))
}

// All-time personal records (highest N×5 weight per lift)
export function getRecords(entries: WorkoutEntry[]): Records {
  const max = (data: LiftData[]) =>
    data.length > 0 ? Math.max(...data.map(d => d.weight)) : null

  return {
    squat:    max(getProgressData('squat',    entries)),
    press:    max(getProgressData('press',    entries)),
    deadlift: max(getProgressData('deadlift', entries)),
  }
}

// Records for a specific calendar year
export function getYearRecords(year: number, entries: WorkoutEntry[]): Records {
  const prefix = `${year}-`
  const filtered = (lift: Lift) =>
    getProgressData(lift, entries).filter(d => d.date.startsWith(prefix))

  const max = (data: LiftData[]) =>
    data.length > 0 ? Math.max(...data.map(d => d.weight)) : null

  return {
    squat:    max(filtered('squat')),
    press:    max(filtered('press')),
    deadlift: max(filtered('deadlift')),
  }
}

// Date when a specific record weight was first achieved
export function getRecordDate(data: LiftData[], value: number | null): string | null {
  if (value === null) return null
  return data.find(d => d.weight === value)?.date ?? null
}

// Latest entry by date
export function getLatestWorkout(entries: WorkoutEntry[]): WorkoutEntry | null {
  if (entries.length === 0) return null
  return entries.slice().sort((a, b) => b.date.localeCompare(a.date))[0]
}

// All entries sorted newest-first (for History)
export function getAllWorkoutsSorted(entries: WorkoutEntry[]): WorkoutEntry[] {
  return entries.slice().sort((a, b) => b.date.localeCompare(a.date))
}

// Unique ID generator
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// "Mon, Jan 15 2024"
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

// "Jan 15"
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Today as YYYY-MM-DD
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
