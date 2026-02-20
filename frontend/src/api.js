const getAuthHeaders = () => {
  const token = localStorage.getItem('tripmate_token')
  return token ? { Authorization: `Token ${token}` } : {}
}

export async function register(username, password, email = '') {
  const res = await fetch('/api/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Registration failed')
  return data
}

export async function login(username, password) {
  const res = await fetch('/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.non_field_errors?.[0] || data.detail || 'Login failed')
  return data
}

export async function getMe() {
  const res = await fetch('/api/auth/me/', { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}

export async function getItineraries() {
  const res = await fetch('/api/itineraries/', { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Failed to load itineraries')
  return res.json()
}

export async function getItinerary(id) {
  const res = await fetch(`/api/itineraries/${id}/`, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Failed to load itinerary')
  return res.json()
}

export async function updateItinerary(id, body) {
  const res = await fetch(`/api/itineraries/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || data.title?.[0] || 'Failed to update')
  return data
}

export async function deleteItinerary(id) {
  const res = await fetch(`/api/itineraries/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Failed to delete')
}

export async function createItinerary(body) {
  const res = await fetch('/api/itineraries/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || data.title?.[0] || 'Failed to save')
  return data
}

// ----- Trip planning -----

export async function createTrip(destination, startDate, endDate, interests = []) {
  const res = await fetch('/api/trips/create/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      destination,
      start_date: startDate,
      end_date: endDate,
      interests: Array.isArray(interests) ? interests : [],
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || data.error?.[0] || 'Failed to create trip')
  return data
}

export async function customizeTrip(plan, action, dayIndex, activityIndex = null, activityType = 'attraction', activityTime = null) {
  const body = { plan, action, day_index: dayIndex }
  if (activityIndex != null) body.activity_index = activityIndex
  if (activityType) body.activity_type = activityType
  if (activityTime) body.activity_time = activityTime
  const res = await fetch('/api/trips/customize/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || 'Failed to customize')
  return data
}

export async function updateTrip(id, body) {
  const res = await fetch(`/api/trips/${id}/edit/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || 'Failed to update')
  return data
}

export async function searchPlaces(q, location = '') {
  const params = new URLSearchParams({ q })
  if (location) params.set('location', location)
  const res = await fetch(`/api/places/search/?${params}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.detail || 'Search failed')
  return data.results || []
}
