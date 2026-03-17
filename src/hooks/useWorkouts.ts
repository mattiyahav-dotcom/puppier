import { useState, useCallback } from 'react'
import {
  loadWorkouts,
  addWorkout,
  updateWorkout,
  deleteWorkout,
} from '../lib/storage'
import type { WorkoutEntry } from '../types'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(() => loadWorkouts())

  const refresh = useCallback(() => {
    setWorkouts(loadWorkouts())
  }, [])

  const add = useCallback((entry: WorkoutEntry) => {
    addWorkout(entry)
    refresh()
  }, [refresh])

  const update = useCallback((entry: WorkoutEntry) => {
    updateWorkout(entry)
    refresh()
  }, [refresh])

  const remove = useCallback((id: string) => {
    deleteWorkout(id)
    refresh()
  }, [refresh])

  return { workouts, add, update, remove, refresh }
}
