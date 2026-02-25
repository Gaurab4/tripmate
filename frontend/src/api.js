const getAuthHeaders = () => {
  const token = localStorage.getItem('tripmate_token')
  return token ? { Authorization: `Token ${token}` } : {}
}

export const GENERIC_ERROR_MESSAGE = 'There is some issue and we are resolving it.'

async function apiFetch(url, options = {}) {
  try {
    const res = await fetch(url, options)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(GENERIC_ERROR_MESSAGE)
    return data
  } catch (e) {
    throw new Error(GENERIC_ERROR_MESSAGE)
  }
}

export async function register(username, password, email = '') {
  const data = await apiFetch('/api/auth/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email }),
  })
  return data
}

export async function login(username, password) {
  return apiFetch('/api/auth/login/', {
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

export async function getItinerary(id) {
  return apiFetch(`/api/itineraries/${id}/`, { headers: getAuthHeaders() })
}

export async function updateItinerary(id, body) {
  return apiFetch(`/api/itineraries/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
}

export async function deleteItinerary(id) {
  return apiFetch(`/api/itineraries/${id}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
}

export async function createItinerary(body) {
  return apiFetch('/api/itineraries/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
}

// ----- Trip planning -----

export async function createTrip(destination, startDate, endDate, interests = []) {
  return apiFetch('/api/trips/create/', {
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

export async function getTripByUuid(uuid) {
  return apiFetch(`/api/trips/${uuid}/`, { headers: getAuthHeaders() })
}

export async function customizeTrip(plan, action, dayIndex, activityIndex = null, activityType = 'attraction', activityTime = null) {
  const body = { plan, action, day_index: dayIndex }
  if (activityIndex != null) body.activity_index = activityIndex
  if (activityType) body.activity_type = activityType
  if (activityTime) body.activity_time = activityTime
  return apiFetch('/api/trips/customize/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function updateTrip(id, body) {
  return apiFetch(`/api/trips/${id}/edit/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  })
}

export async function searchPlaces(q, location = '') {
  const params = new URLSearchParams({ q })
  if (location) params.set('location', location)
  const data = await apiFetch(`/api/places/search/?${params}`)
  return data.results || []
}
