import { Link } from 'react-router-dom'
import { ChevronRight, Clock } from 'lucide-react'
import { getAllWorkoutsSorted, formatDate } from '../lib/data'
import { useWorkouts } from '../hooks/useWorkouts'
import EmptyState from '../components/EmptyState'

export default function History() {
  const { workouts, loading } = useWorkouts()
  const entries = getAllWorkoutsSorted(workouts)

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-stone-900 mb-5">History</h1>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[0,1,2,3].map(i => (
            <div key={i} className="bg-stone-100 animate-pulse rounded-2xl h-20" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Clock size={22} />}
          title="No workouts logged"
          description="Your workout history will appear here"
          action={
            <Link
              to="/app/add"
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              Log Workout
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map(entry => (
            <Link
              key={entry.id}
              to={`/app/edit/${entry.id}`}
              className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between hover:border-amber-200 hover:bg-amber-50/30 transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-stone-900 mb-2">
                  {formatDate(entry.date)}
                </div>
                <div className="flex gap-4">
                  {[
                    { label: 'SQ',  vol: entry.squatVolume,    wt: entry.squatWeight    },
                    { label: 'PR',  vol: entry.pressVolume,    wt: entry.pressWeight    },
                    { label: 'DL',  vol: entry.deadliftVolume, wt: entry.deadliftWeight },
                  ].map(({ label, vol, wt }) => (
                    <div key={label}>
                      <span className="text-xs text-stone-400">{label} </span>
                      <span className="text-xs font-medium text-stone-700">
                        {wt !== null && wt !== undefined ? `${wt}kg` : '—'}
                      </span>
                      {vol && (
                        <span className="text-xs text-stone-400 ml-0.5">/{vol}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-3">
                {entry.createdBy === 'instructor' && (
                  <span className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded-md mr-1">Zohar</span>
                )}
                <ChevronRight size={16} className="text-stone-300" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
