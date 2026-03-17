import { getRecords, getProgressData } from '../lib/data'
import { Trophy } from 'lucide-react'
import EmptyState from '../components/EmptyState'

export default function Records() {
  const records = getRecords()
  const hasAny  = Object.values(records).some(v => v !== null)

  const lifts = [
    { label: 'Squat',    value: records.squat,    history: getProgressData('squat')    },
    { label: 'Press',    value: records.press,    history: getProgressData('press')    },
    { label: 'Deadlift', value: records.deadlift, history: getProgressData('deadlift') },
  ]

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-stone-900 mb-1">Records</h1>
      <p className="text-xs text-stone-500 mb-5">Best 1x5 lifts — highest weight per date</p>

      {!hasAny ? (
        <EmptyState
          icon={<Trophy size={22} />}
          title="No records yet"
          description="Log workouts with 1x5 volume to start tracking your personal records"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {lifts.map(({ label, value, history }) => {
            // Find the date of the PR
            const prDate = history.length > 0
              ? history.reduce((best, d) => d.weight > best.weight ? d : best, history[0]).date
              : null

            // Progress bar: current vs best (always 100% for PR)
            const pct = value !== null ? 100 : 0

            return (
              <div key={label} className="bg-white rounded-2xl border border-stone-200 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-0.5">{label}</div>
                    <div className="flex items-end gap-1">
                      {value !== null ? (
                        <>
                          <span className="text-4xl font-bold text-stone-900 leading-none">{value}</span>
                          <span className="text-base text-stone-400 pb-0.5">kg</span>
                        </>
                      ) : (
                        <span className="text-3xl font-semibold text-stone-200">—</span>
                      )}
                    </div>
                    {prDate && (
                      <div className="text-xs text-stone-400 mt-1">
                        Set on {new Date(prDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Trophy size={18} className="text-amber-600" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full progress-bar"
                    style={{ '--target-width': `${pct}%` } as React.CSSProperties}
                  />
                </div>

                {/* Session count */}
                {history.length > 0 && (
                  <div className="mt-2 text-xs text-stone-400">
                    {history.length} qualifying session{history.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
