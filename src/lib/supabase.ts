import { createClient } from '@supabase/supabase-js'
import type { WorkoutEntry } from '../types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY as string

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── DB row shape (snake_case columns) ─────────────────────────────────────────

export interface WorkoutRow {
  id: string
  date: string
  squat_volume:    string | null
  squat_weight:    number | null
  press_volume:    string | null
  press_weight:    number | null
  deadlift_volume: string | null
  deadlift_weight: number | null
  created_by:      string | null
  created_at:      string
}

// ── Mappers ───────────────────────────────────────────────────────────────────

export function rowToEntry(row: WorkoutRow): WorkoutEntry {
  return {
    id:              row.id,
    date:            row.date,
    squatVolume:     row.squat_volume    ?? '',
    squatWeight:     row.squat_weight,
    pressVolume:     row.press_volume    ?? '',
    pressWeight:     row.press_weight,
    deadliftVolume:  row.deadlift_volume ?? '',
    deadliftWeight:  row.deadlift_weight,
    createdBy:       (row.created_by ?? 'athlete') as WorkoutEntry['createdBy'],
    createdAt:       row.created_at,
  }
}

export function entryToRow(entry: WorkoutEntry): WorkoutRow {
  return {
    id:              entry.id,
    date:            entry.date,
    squat_volume:    entry.squatVolume    || null,
    squat_weight:    entry.squatWeight    ?? null,
    press_volume:    entry.pressVolume    || null,
    press_weight:    entry.pressWeight    ?? null,
    deadlift_volume: entry.deadliftVolume || null,
    deadlift_weight: entry.deadliftWeight ?? null,
    created_by:      entry.createdBy,
    created_at:      entry.createdAt,
  }
}
