import type { DayPlan } from './types'

export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('tripmate_token')
  return token ? { Authorization: `Token ${token}` } : {}
}

export const GENERIC_ERROR_MESSAGE = 'There is some issue and we are resolving it.'

async function apiFetch<T = Record<string, unknown>>(url: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`
  try {
    const res = await fetch(fullUrl, options)
    const data = (await res.json().catch(() => ({}))) as T
    if (!res.ok) throw new Error(GENERIC_ERROR_MESSAGE)
    return data
  } catch {
    throw new Error(GENERIC_ERROR_MESSAGE)
  }
}

export async function register(username: string, password: string, email = '') {
  return apiFetch('/api/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  })
}

export async function login(username: string, password: string) {
  return apiFetch<{ token: string }>('/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export async function getMe() {
  return apiFetch('/api/auth/me/', { headers: getAuthHeaders() })
}

export async function getItineraries() {
  return apiFetch('/api/itineraries/', { headers: getAuthHeaders() })
}

export async function getItinerary(id: string) {
  return apiFetch(`/api/itineraries/${id}/`, { headers: getAuthHeaders() })
}

export async function updateItinerary(id: string, body: Record<string, unknown>) {
  return apiFetch<{ title?: string }>(`/api/itineraries/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
}

export async function deleteItinerary(id: string) {
  return apiFetch(`/api/itineraries/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
}

export async function createItinerary(body: Record<string, unknown>) {
  return apiFetch('/api/itineraries/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
}

export async function createTrip(
  destination: string,
  startDate: string | undefined,
  endDate: string | undefined,
  interests: string[] = []
) {
  return apiFetch<{ uuid: string }>('/api/trips/create/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destination,
      start_date: startDate,
      end_date: endDate,
      interests: Array.isArray(interests) ? interests : [],
    }),
  })
}

export async function getTripByUuid(uuid: string) {
  return apiFetch<{
    status: string
    destination?: string
    start_date?: string
    end_date?: string
    interests?: string[]
    plan?: DayPlan[]
    flights?: unknown[]
    hotels?: unknown[]
    error_message?: string
  }>(`/api/trips/${uuid}/`, { headers: getAuthHeaders() })
}

export async function customizeTrip(
  plan: DayPlan[],
  action: string,
  dayIndex: number,
  activityIndex: number | null | undefined = null,
  activityType = 'attraction',
  activityTime: string | null = null
) {
  const body: Record<string, unknown> = { plan, action, day_index: dayIndex }
  if (activityIndex != null) body.activity_index = activityIndex
  if (activityType) body.activity_type = activityType
  if (activityTime) body.activity_time = activityTime
  return apiFetch<{ plan: DayPlan[] }>('/api/trips/customize/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function updateTrip(id: string, body: Record<string, unknown>) {
  return apiFetch(`/api/trips/${id}/edit/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
}

export async function searchPlaces(q: string, location = '') {
  const params = new URLSearchParams({ q })
  if (location) params.set('location', location)
  const data = await apiFetch<{ results?: unknown[] }>(`/api/places/search/?${params}`)
  return data.results || []
}
