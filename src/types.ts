// Core data types for Puppier

export type LiftVolume = string // e.g. "1x5", "3x3", "5x5", "1x1"

export interface WorkoutEntry {
  id: string
  date: string           // ISO date string "YYYY-MM-DD"
  squatVolume: LiftVolume
  squatWeight: number | null
  pressVolume: LiftVolume
  pressWeight: number | null
  deadliftVolume: LiftVolume
  deadliftWeight: number | null
  createdBy: UserRole    // who logged this entry
  createdAt: string      // ISO timestamp
}

export type UserRole = 'athlete' | 'instructor'

export interface User {
  role: UserRole
  name: string
}

export interface LiftData {
  date: string
  weight: number
}

export interface Records {
  squat: number | null
  press: number | null
  deadlift: number | null
}

// Import row from CSV
export interface ImportRow {
  date: string
  squatVolume: string
  squatWeight: string
  pressVolume: string
  pressWeight: string
  deadliftVolume: string
  deadliftWeight: string
}

export interface ImportResult {
  imported: WorkoutEntry[]
  skipped: { row: number; reason: string }[]
}
