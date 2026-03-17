// CSV import: parse, validate, and map Google Sheets exports to WorkoutEntry

import type { WorkoutEntry, ImportResult } from '../types'
import { generateId } from './data'
import { loadWorkouts, saveWorkouts } from './storage'

// Expected CSV columns (case-insensitive, order flexible)
// date, squat_volume, squat_weight, press_volume, press_weight, deadlift_volume, deadlift_weight

function normalizeHeader(h: string): string {
  return h.toLowerCase().trim().replace(/[\s-]/g, '_')
}

function parseWeight(raw: string): number | null {
  if (!raw || raw.trim() === '' || raw.trim() === '-') return null
  const n = parseFloat(raw.replace(/[^\d.]/g, ''))
  return isNaN(n) ? null : n
}

function parseVolume(raw: string): string {
  return (raw || '').trim()
}

function isValidDate(s: string): boolean {
  // Accept YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY
  const d = new Date(s)
  return !isNaN(d.getTime())
}

function toISODate(s: string): string {
  // Try to convert various date formats to YYYY-MM-DD
  const trimmed = s.trim()
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  // MM/DD/YYYY
  const mdy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, '0')}-${mdy[2].padStart(2, '0')}`
  // Fallback: parse and re-format
  const d = new Date(trimmed)
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return trimmed
}

export interface ParsedCSVRow {
  rowIndex: number
  date: string
  squatVolume: string
  squatWeight: number | null
  pressVolume: string
  pressWeight: number | null
  deadliftVolume: string
  deadliftWeight: number | null
  valid: boolean
  error?: string
}

export function parseCSV(csvText: string): ParsedCSVRow[] {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length < 2) return []

  // Parse header
  const headers = lines[0].split(',').map(normalizeHeader)

  const colIdx = (names: string[]): number => {
    for (const name of names) {
      const i = headers.indexOf(name)
      if (i !== -1) return i
    }
    return -1
  }

  const dateCol    = colIdx(['date'])
  const sqVolCol   = colIdx(['squat_volume', 'squatvolume', 'squat_vol'])
  const sqWtCol    = colIdx(['squat_weight', 'squatweight', 'squat_wt', 'squat'])
  const prVolCol   = colIdx(['press_volume', 'pressvolume', 'press_vol'])
  const prWtCol    = colIdx(['press_weight', 'pressweight', 'press_wt', 'press'])
  const dlVolCol   = colIdx(['deadlift_volume', 'deadliftvolume', 'deadlift_vol'])
  const dlWtCol    = colIdx(['deadlift_weight', 'deadliftweight', 'deadlift_wt', 'deadlift'])

  const rows: ParsedCSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',')
    const raw = (col: number) => (col >= 0 ? (cells[col] || '').trim() : '')

    const dateRaw = raw(dateCol)
    const isoDate = toISODate(dateRaw)

    const row: ParsedCSVRow = {
      rowIndex: i + 1,
      date: isoDate,
      squatVolume:    parseVolume(raw(sqVolCol)),
      squatWeight:    parseWeight(raw(sqWtCol)),
      pressVolume:    parseVolume(raw(prVolCol)),
      pressWeight:    parseWeight(raw(prWtCol)),
      deadliftVolume: parseVolume(raw(dlVolCol)),
      deadliftWeight: parseWeight(raw(dlWtCol)),
      valid: true,
    }

    // Validate date
    if (!dateRaw || !isValidDate(isoDate)) {
      row.valid = false
      row.error = `Invalid date: "${dateRaw}"`
    }

    // Must have at least one lift with weight
    if (row.squatWeight === null && row.pressWeight === null && row.deadliftWeight === null) {
      row.valid = false
      row.error = row.error || 'No lift weights found in row'
    }

    rows.push(row)
  }

  return rows
}

export function importCSVRows(rows: ParsedCSVRow[]): ImportResult {
  const existing = loadWorkouts()
  const imported: WorkoutEntry[] = []
  const skipped: { row: number; reason: string }[] = []

  for (const row of rows) {
    if (!row.valid) {
      skipped.push({ row: row.rowIndex, reason: row.error || 'Invalid row' })
      continue
    }

    const entry: WorkoutEntry = {
      id:              generateId(),
      date:            row.date,
      squatVolume:     row.squatVolume,
      squatWeight:     row.squatWeight,
      pressVolume:     row.pressVolume,
      pressWeight:     row.pressWeight,
      deadliftVolume:  row.deadliftVolume,
      deadliftWeight:  row.deadliftWeight,
      createdBy:       'athlete',
      createdAt:       new Date().toISOString(),
    }

    imported.push(entry)
  }

  // Merge: save imported + existing (no deduplication on date, allow multiple entries per date)
  saveWorkouts([...existing, ...imported])

  return { imported, skipped }
}
