import { useState, useEffect, useCallback } from 'react'
import { supabase, rowToEntry, entryToRow } from '../lib/supabase'
import { loadWorkouts } from '../lib/storage'
import type { WorkoutEntry } from '../types'

const MIGRATED_KEY = 'puppier_migrated'

// One-time migration: if Supabase is empty and localStorage has data, upload it
async function migrateIfNeeded() {
  if (localStorage.getItem(MIGRATED_KEY)) return

  const local = loadWorkouts()
  if (local.length === 0) {
    localStorage.setItem(MIGRATED_KEY, '1')
    return
  }

  const { count } = await supabase
    .from('workouts')
    .select('*', { count: 'exact', head: true })

  if (count === 0) {
    const { error } = await supabase.from('workouts').insert(local.map(entryToRow))
    if (!error) localStorage.setItem(MIGRATED_KEY, '1')
  } else {
    // Supabase already has data — just mark done
    localStorage.setItem(MIGRATED_KEY, '1')
  }
}

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([])
  const [loading,  setLoading]  = useState(true)

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('date', { ascending: true })
    if (!error && data) setWorkouts(data.map(rowToEntry))
    setLoading(false)
  }, [])

  useEffect(() => {
    // Migrate then fetch
    migrateIfNeeded().then(fetchAll)

    // Refetch when tab regains focus
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchAll()
    }
    document.addEventListener('visibilitychange', onVisible)

    // Poll every 30 s so Zohar/Matti see each other's additions without refresh
    const timer = setInterval(fetchAll, 30_000)

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      clearInterval(timer)
    }
  }, [fetchAll])

  const add = useCallback(async (entry: WorkoutEntry) => {
    const { error } = await supabase.from('workouts').insert(entryToRow(entry))
    if (!error) setWorkouts(prev => [...prev, entry])
  }, [])

  const update = useCallback(async (entry: WorkoutEntry) => {
    const { error } = await supabase
      .from('workouts')
      .update(entryToRow(entry))
      .eq('id', entry.id)
    if (!error) setWorkouts(prev => prev.map(w => w.id === entry.id ? entry : w))
  }, [])

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from('workouts').delete().eq('id', id)
    if (!error) setWorkouts(prev => prev.filter(w => w.id !== id))
  }, [])

  // Bulk upsert for CSV import (uses id as conflict key)
  const importMany = useCallback(async (entries: WorkoutEntry[]): Promise<number> => {
    const { error } = await supabase
      .from('workouts')
      .upsert(entries.map(entryToRow), { onConflict: 'id' })
    if (error) return 0
    await fetchAll()
    return entries.length
  }, [fetchAll])

  return { workouts, loading, add, update, remove, importMany }
}
