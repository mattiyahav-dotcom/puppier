// Reusable input group for a single lift (volume + weight)

interface Props {
  lift: string      // "Squat" | "Press" | "Deadlift"
  volume: string
  weight: string
  onVolumeChange: (v: string) => void
  onWeightChange: (v: string) => void
}

const VOLUME_PRESETS = ['1x5', '3x3', '5x5', '1x3', '1x1', '3x5']

export default function LiftInputGroup({ lift, volume, weight, onVolumeChange, onWeightChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">
      <h3 className="text-sm font-semibold text-stone-900 mb-3">{lift}</h3>

      {/* Volume */}
      <div className="mb-3">
        <label className="block text-xs text-stone-500 mb-1.5">Volume</label>
        <input
          type="text"
          value={volume}
          onChange={e => onVolumeChange(e.target.value)}
          placeholder="e.g. 1x5"
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
        />
        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {VOLUME_PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => onVolumeChange(preset)}
              className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                volume === preset
                  ? 'bg-amber-50 border-amber-300 text-amber-700 font-medium'
                  : 'border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-xs text-stone-500 mb-1.5">Weight (kg)</label>
        <input
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={e => onWeightChange(e.target.value)}
          placeholder="e.g. 100"
          min="0"
          step="0.5"
          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
        />
      </div>
    </div>
  )
}
