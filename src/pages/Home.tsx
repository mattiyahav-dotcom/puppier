import { Link } from 'react-router-dom'
import { Plus, Dumbbell } from 'lucide-react'
import { getLatestWorkout, getRecords, formatDate } from '../lib/data'
import { useWorkouts } from '../hooks/useWorkouts'
import PRCard from '../components/PRCard'
import EmptyState from '../components/EmptyState'

export default function Home() {
  const { workouts, loading } = useWorkouts()
  const latest  = getLatestWorkout(workouts)
  const records = getRecords(workouts)

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Dashboard</h1>
          <p className="text-xs text-stone-500 mt-0.5">Your training at a glance</p>
        </div>
        <Link
          to="/app/add"
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-3 py-2 rounded-xl transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} />
          Log Workout
        </Link>
      </div>

      {/* Personal Records */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Personal Records
        </h2>
        {loading ? (
          <div className="grid grid-cols-3 gap-2">
            {[0,1,2].map(i => (
              <div key={i} className="bg-stone-100 animate-pulse rounded-2xl h-20" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <PRCard lift="Squat"    weight={records.squat}    />
            <PRCard lift="Press"    weight={records.press}    />
            <PRCard lift="Deadlift" weight={records.deadlift} />
          </div>
        )}
      </section>

      {/* Latest workout */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Latest Workout
        </h2>
        {loading ? (
          <div className="bg-stone-100 animate-pulse rounded-2xl h-28" />
        ) : latest ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-stone-900">{formatDate(latest.date)}</span>
              <Link
                to={`/app/edit/${latest.id}`}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                Edit
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Squat',    vol: latest.squatVolume,    wt: latest.squatWeight    },
                { label: 'Press',    vol: latest.pressVolume,    wt: latest.pressWeight    },
                { label: 'Deadlift', vol: latest.deadliftVolume, wt: latest.deadliftWeight },
              ].map(({ label, vol, wt }) => (
                <div key={label}>
                  <div className="text-xs text-stone-500 mb-0.5">{label}</div>
                  <div className="text-sm font-semibold text-stone-900">
                    {wt !== null && wt !== undefined ? `${wt} kg` : '—'}
                  </div>
                  {vol && <div className="text-xs text-stone-400">{vol}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Dumbbell size={22} />}
            title="No workouts yet"
            description="Log your first workout to start tracking progress"
            action={
              <Link
                to="/app/add"
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              >
                Log Workout
              </Link>
            }
          />
        )}
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/app/progress"
            className="bg-white border border-stone-200 rounded-2xl p-4 hover:border-amber-200 hover:bg-amber-50 transition-all"
          >
            <div className="text-sm font-semibold text-stone-900 mb-0.5">Progress</div>
            <div className="text-xs text-stone-500">View lift trends</div>
          </Link>
          <Link
            to="/app/import"
            className="bg-white border border-stone-200 rounded-2xl p-4 hover:border-amber-200 hover:bg-amber-50 transition-all"
          >
            <div className="text-sm font-semibold text-stone-900 mb-0.5">Import</div>
            <div className="text-xs text-stone-500">Upload CSV data</div>
          </Link>
        </div>
      </section>
    </div>
  )
}
