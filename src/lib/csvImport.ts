// CSV import: parse and validate Google Sheets exports → WorkoutEntry[]
// Saving is handled by the caller via useWorkouts().importMany()

import type { WorkoutEntry } from '../types'
import { generateId } from './data'

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
  const d = new Date(s)
  return !isNaN(d.getTime())
}

function toISODate(s: string): string {
  const trimmed = s.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  // MM/DD/YYYY
  const mdy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2,'0')}-${mdy[2].padStart(2,'0')}`
  // YYYY/MM/DD
  const ymd = trimmed.match(/^(\d{4})\/(\d{2})\/(\d{2})$/)
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`
  const d = new Date(trimmed)
  if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  return trimmed
}

export interface ParsedCSVRow {
  rowIndex:       number
  date:           string
  squatVolume:    string
  squatWeight:    number | null
  pressVolume:    string
  pressWeight:    number | null
  deadliftVolume: string
  deadliftWeight: number | null
  valid:          boolean
  error?:         string
}

export function parseCSV(csvText: string): ParsedCSVRow[] {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(normalizeHeader)

  const colIdx = (names: string[]): number => {
    for (const name of names) {
      const i = headers.indexOf(name)
      if (i !== -1) return i
    }
    return -1
  }

  const dateCol  = colIdx(['date'])
  const sqVolCol = colIdx(['squat_volume','squatvolume','squat_vol','sq:_vol','sq:_volume'])
  const sqWtCol  = colIdx(['squat_weight','squatweight','squat_wt','squat','sq:_weight'])
  const prVolCol = colIdx(['press_volume','pressvolume','press_vol','pr:_vol','pr:_volume'])
  const prWtCol  = colIdx(['press_weight','pressweight','press_wt','press','pr:_weight'])
  const dlVolCol = colIdx(['deadlift_volume','deadliftvolume','deadlift_vol','dl:_vol','dl:_volume'])
  const dlWtCol  = colIdx(['deadlift_weight','deadliftweight','deadlift_wt','deadlift','dl:_weight'])

  const rows: ParsedCSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',')
    const raw   = (col: number) => (col >= 0 ? (cells[col] || '').trim() : '')

    const dateRaw = raw(dateCol)
    const isoDate = toISODate(dateRaw)

    const row: ParsedCSVRow = {
      rowIndex:       i + 1,
      date:           isoDate,
      squatVolume:    parseVolume(raw(sqVolCol)),
      squatWeight:    parseWeight(raw(sqWtCol)),
      pressVolume:    parseVolume(raw(prVolCol)),
      pressWeight:    parseWeight(raw(prWtCol)),
      deadliftVolume: parseVolume(raw(dlVolCol)),
      deadliftWeight: parseWeight(raw(dlWtCol)),
      valid:          true,
    }

    if (!dateRaw || !isValidDate(isoDate)) {
      row.valid = false
      row.error = `Invalid date: "${dateRaw}"`
    }

    if (row.squatWeight === null && row.pressWeight === null && row.deadliftWeight === null) {
      row.valid = false
      row.error = row.error || 'No lift weights found in row'
    }

    rows.push(row)
  }

  return rows
}

// Convert valid ParsedCSVRows to WorkoutEntry[] — caller handles saving
export function csvRowsToEntries(rows: ParsedCSVRow[]): WorkoutEntry[] {
  return rows
    .filter(r => r.valid)
    .map(row => ({
      id:             generateId(),
      date:           row.date,
      squatVolume:    row.squatVolume,
      squatWeight:    row.squatWeight,
      pressVolume:    row.pressVolume,
      pressWeight:    row.pressWeight,
      deadliftVolume: row.deadliftVolume,
      deadliftWeight: row.deadliftWeight,
      createdBy:      'athlete' as const,
      createdAt:      new Date().toISOString(),
    }))
}
