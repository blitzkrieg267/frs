import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  count: number
  user: { name: string; email: string } | null
  increment: () => void
  decrement: () => void
  setUser: (user: { name: string; email: string } | null) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        count: 0,
        user: null,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        setUser: (user) => set({ user }),
      }),
      {
        name: 'app-storage',
      }
    )
  )
)
