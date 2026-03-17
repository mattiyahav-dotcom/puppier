import type { UserRole } from '../types'

interface Props {
  onSelect: (role: UserRole) => void
}

export default function UserSelect({ onSelect }: Props) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Welcome to Puppier</h1>
          <p className="text-sm text-stone-500">Choose your profile to continue</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onSelect('athlete')}
            className="bg-white border border-stone-200 rounded-2xl p-5 text-left hover:border-amber-300 hover:bg-amber-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                <span className="text-lg font-bold text-stone-600 group-hover:text-amber-700">A</span>
              </div>
              <div>
                <div className="font-semibold text-stone-900 text-sm">Athlete</div>
                <div className="text-xs text-stone-500 mt-0.5">Log and track your own workouts</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelect('instructor')}
            className="bg-white border border-stone-200 rounded-2xl p-5 text-left hover:border-amber-300 hover:bg-amber-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                <span className="text-lg font-bold text-stone-600 group-hover:text-amber-700">I</span>
              </div>
              <div>
                <div className="font-semibold text-stone-900 text-sm">Instructor</div>
                <div className="text-xs text-stone-500 mt-0.5">Add and review athlete workouts</div>
              </div>
            </div>
          </button>
        </div>

        <p className="text-xs text-stone-400 text-center mt-6">
          Both profiles share the same training log on this device.
          <br />Use Import / Export to sync across devices.
        </p>
      </div>
    </div>
  )
}
