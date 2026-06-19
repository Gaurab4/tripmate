import type { Dispatch, SetStateAction } from 'react'

export interface Activity {
  id?: string | number
  name: string
  icon?: string
  time?: string
  description?: string
  duration?: string | number
  duration_minutes?: number
}

export interface DayPlan {
  day: number
  date?: string
  activities?: Activity[]
}

export interface TripPayload {
  destination: string
  start_date?: string
  end_date?: string
  interests?: string[]
  plan?: DayPlan[]
  flights?: unknown[]
  hotels?: unknown[]
  title?: string
  uuid?: string
  created_at?: string
}

export interface User {
  username?: string
  [key: string]: unknown
}

export interface AuthContextValue {
  token: string | null
  user: User | null
  loading: boolean
  setToken: (newToken: string | null) => void
  setUser: Dispatch<SetStateAction<User | null>>
  logout: () => void
  isAuthenticated: boolean
}

export interface ThemeContextValue {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export interface TripFormValues {
  destination: string
  startDate?: string
  endDate?: string
  interests: string[]
}

export interface TripFormProps {
  onSubmit: (values: TripFormValues) => void | Promise<void>
  loading: boolean
  initialValues?: TripFormValues | null
}

export interface SavedItinerary {
  uuid: string
  title?: string
  destination?: string
  start_date?: string
  end_date?: string
  plan?: DayPlan[]
  created_at?: string
}
