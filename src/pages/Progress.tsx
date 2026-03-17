import { getProgressData, formatDateShort } from '../lib/data'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import EmptyState from '../components/EmptyState'

type Lift = 'squat' | 'press' | 'deadlift'

const LIFTS: { key: Lift; label: string; color: string }[] = [
  { key: 'squat',    label: 'Squat',    color: '#d97706' },
  { key: 'press',    label: 'Press',    color: '#b45309' },
  { key: 'deadlift', label: 'Deadlift', color: '#92400e' },
]

function LiftChart({ liftKey, label, color }: { liftKey: Lift; label: string; color: string }) {
  const raw = getProgressData(liftKey)
  const data = raw.map(d => ({ date: formatDateShort(d.date), weight: d.weight }))

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-4">
        <h3 className="text-sm font-semibold text-stone-900 mb-3">{label}</h3>
        <p className="text-xs text-stone-400 text-center py-8">No 1x5 entries yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-4">
      <h3 className="text-sm font-semibold text-stone-900 mb-1">{label}</h3>
      <p className="text-xs text-stone-400 mb-4">Weight progress · 1x5 entries only</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#a8a29e' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#a8a29e' }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e7e5e4',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: 'none',
            }}
            formatter={(v) => [`${v} kg`, 'Weight']}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Progress() {
  const hasAny = LIFTS.some(l => getProgressData(l.key).length > 0)

  return (
    <div className="px-4 py-5 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-stone-900 mb-1">Progress</h1>
      <p className="text-xs text-stone-500 mb-5">Charts only include 1x5 qualifying entries, highest weight per date</p>

      {!hasAny ? (
        <EmptyState
          icon={<TrendingUp size={22} />}
          title="No progress data yet"
          description="Log workouts with 1x5 volume to see your progress charts"
        />
      ) : (
        LIFTS.map(l => (
          <LiftChart key={l.key} liftKey={l.key} label={l.label} color={l.color} />
        ))
      )}
    </div>
  )
}
