import type { ReactNode } from 'react'
import BottomNav from './BottomNav'
import type { UserRole } from '../types'

interface Props {
  role: UserRole
  onLogout: () => void
  children: ReactNode
}

export default function AppShell({ role, onLogout, children }: Props) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <span className="font-semibold text-stone-900 text-base tracking-tight">Puppier</span>
        <button
          onClick={onLogout}
          className="text-xs text-stone-500 hover:text-stone-800 transition-colors px-2 py-1 rounded-lg hover:bg-stone-100"
        >
          {role === 'athlete' ? 'Athlete' : 'Instructor'} · Switch
        </button>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
