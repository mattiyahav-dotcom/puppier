// localStorage persistence layer
// Swap this module for a Supabase client to enable real-time multi-device sync.

import type { WorkoutEntry, UserRole } from '../types'

const WORKOUTS_KEY = 'puppier_workouts'
const USER_KEY = 'puppier_user'

// ── Workouts ─────────────────────────────────────────────────────────────────

export function loadWorkouts(): WorkoutEntry[] {
  try {
    const raw = localStorage.getItem(WORKOUTS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as WorkoutEntry[]
  } catch {
    return []
  }
}

export function saveWorkouts(entries: WorkoutEntry[]): void {
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(entries))
}

export function addWorkout(entry: WorkoutEntry): void {
  const all = loadWorkouts()
  all.push(entry)
  saveWorkouts(all)
}

export function updateWorkout(updated: WorkoutEntry): void {
  const all = loadWorkouts()
  const idx = all.findIndex(e => e.id === updated.id)
  if (idx !== -1) {
    all[idx] = updated
    saveWorkouts(all)
  }
}

export function deleteWorkout(id: string): void {
  const all = loadWorkouts().filter(e => e.id !== id)
  saveWorkouts(all)
}

// ── Current user ──────────────────────────────────────────────────────────────

export function loadUser(): UserRole | null {
  return (localStorage.getItem(USER_KEY) as UserRole) || null
}

export function saveUser(role: UserRole): void {
  localStorage.setItem(USER_KEY, role)
}

// ── JSON export / import (for cross-device collaboration) ─────────────────────

export function exportJSON(): string {
  return JSON.stringify(loadWorkouts(), null, 2)
}

export function importJSON(json: string): { count: number; error?: string } {
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) return { count: 0, error: 'Invalid format' }

    const existing = loadWorkouts()
    const existingIds = new Set(existing.map(e => e.id))
    const newEntries = (parsed as WorkoutEntry[]).filter(e => !existingIds.has(e.id))
    saveWorkouts([...existing, ...newEntries])
    return { count: newEntries.length }
  } catch {
    return { count: 0, error: 'Failed to parse JSON' }
  }
}
