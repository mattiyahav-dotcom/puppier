// Personal record card used on Records and Home screens

interface Props {
  lift: string
  weight: number | null
  unit?: string
}

export default function PRCard({ lift, weight, unit = 'kg' }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 flex flex-col gap-1">
      <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">{lift}</span>
      {weight !== null ? (
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-stone-900 leading-none">{weight}</span>
          <span className="text-sm text-stone-400 pb-0.5">{unit}</span>
        </div>
      ) : (
        <span className="text-2xl font-semibold text-stone-300">—</span>
      )}
    </div>
  )
}
