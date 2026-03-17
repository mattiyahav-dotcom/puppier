import { NavLink } from 'react-router-dom'
import { Home, Clock, TrendingUp, Trophy, Upload } from 'lucide-react'

const tabs = [
  { to: '/app',          label: 'Home',     Icon: Home        },
  { to: '/app/history',  label: 'History',  Icon: Clock       },
  { to: '/app/progress', label: 'Progress', Icon: TrendingUp  },
  { to: '/app/records',  label: 'Records',  Icon: Trophy      },
  { to: '/app/import',   label: 'Import',   Icon: Upload      },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-40 pb-safe">
      <div className="flex items-stretch">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/app'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                isActive
                  ? 'text-amber-600'
                  : 'text-stone-400 hover:text-stone-700'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
