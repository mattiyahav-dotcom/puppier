import { getRecords, getYearRecords, getProgressData, getRecordDate } from '../lib/data'
import { useWorkouts } from '../hooks/useWorkouts'
import { Trophy, Star } from 'lucide-react'
import EmptyState from '../components/EmptyState'

const CURRENT_YEAR = 2026

function fmt(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function Records() {
  const { workouts, loading } = useWorkouts()
  const allTime  = getRecords(workouts)
  const thisYear = getYearRecords(CURRENT_YEAR, workouts)
  const hasAny   = Object.values(allTime).some(v => v !== null)

  const lifts = [
    { label: 'Squat',    best: allTime.squat,    year: thisYear.squat,    history: getProgressData('squat',    workouts) },
    { label: 'Press',    best: allTime.press,    year: thisYear.press,    history: getProgressData('press',    workouts) },
    { label: 'Deadlift', best: allTime.deadlift, year: thisYear.deadlift, history: getProgressData('deadlift', workouts) },
  ]

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-stone-900 mb-1">Records</h1>
      <p className="text-xs text-stone-500 mb-5">Best sets of 5 reps — highest weight per date</p>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[0,1,2].map(i => (
            <div key={i} className="bg-stone-100 animate-pulse rounded-2xl h-44" />
          ))}
        </div>
      ) : !hasAny ? (
        <EmptyState
          icon={<Trophy size={22} />}
          title="No records yet"
          description="Log workouts with sets of 5 reps to start tracking your personal records"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {lifts.map(({ label, best, year, history }) => {
            const bestDate = getRecordDate(history, best)
            const yearDate = getRecordDate(
              history.filter(d => d.date.startsWith(`${CURRENT_YEAR}-`)),
              year,
            )
            const pct = best !== null && year !== null
              ? Math.round((year / best) * 100)
              : best !== null ? 100 : 0

            return (
              <div key={label} className="bg-white rounded-2xl border border-stone-200 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Trophy size={15} className="text-amber-600" />
                  </div>
                </div>

                {/* Two stat columns */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Best ever */}
                  <div className="bg-stone-50 rounded-xl p-3">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Trophy size={11} className="text-amber-500" />
                      <span className="text-xs font-medium text-stone-500">Best ever</span>
                    </div>
                    {best !== null ? (
                      <>
                        <div className="flex items-end gap-0.5">
                          <span className="text-2xl font-bold text-stone-900 leading-none">{best}</span>
                          <span className="text-xs text-stone-400 pb-0.5">kg</span>
                        </div>
                        {bestDate && <div className="text-xs text-stone-400 mt-1">{fmt(bestDate)}</div>}
                      </>
                    ) : (
                      <span className="text-2xl font-semibold text-stone-200">—</span>
                    )}
                  </div>

                  {/* This year */}
                  <div className="bg-amber-50 rounded-xl p-3">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star size={11} className="text-amber-500" />
                      <span className="text-xs font-medium text-amber-700">{CURRENT_YEAR}</span>
                    </div>
                    {year !== null ? (
                      <>
                        <div className="flex items-end gap-0.5">
                          <span className="text-2xl font-bold text-amber-800 leading-none">{year}</span>
                          <span className="text-xs text-amber-600 pb-0.5">kg</span>
                        </div>
                        {yearDate && <div className="text-xs text-amber-600 mt-1">{fmt(yearDate)}</div>}
                      </>
                    ) : (
                      <span className="text-2xl font-semibold text-amber-200">—</span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {best !== null && (
                  <>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full progress-bar"
                        style={{ '--target-width': `${pct}%` } as React.CSSProperties}
                      />
                    </div>
                    <div className="mt-1.5 text-xs text-stone-400">
                      {year !== null
                        ? `${CURRENT_YEAR} best is ${pct}% of all-time record`
                        : `No ${CURRENT_YEAR} entries yet`}
                    </div>
                  </>
                )}

                {history.length > 0 && (
                  <div className="mt-2 text-xs text-stone-400">
                    {history.length} qualifying session{history.length !== 1 ? 's' : ''} total
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
