import { useState } from 'react'
import { loadUser, saveUser } from '../lib/storage'
import type { UserRole } from '../types'

export function useUser() {
  const [role, setRole] = useState<UserRole | null>(() => loadUser())

  const login = (r: UserRole) => {
    saveUser(r)
    setRole(r)
  }

  const logout = () => {
    setRole(null)
  }

  return { role, login, logout }
}
