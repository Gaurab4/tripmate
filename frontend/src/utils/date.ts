const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return ''

  const d = dateStr.includes('T') ? new Date(dateStr) : new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(d.getTime())) return dateStr

  const day = String(d.getDate()).padStart(2, '0')
  const month = MONTHS[d.getMonth()]
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatDateRange(start?: string, end?: string): string {
  if (start && end) return `${formatDisplayDate(start)} – ${formatDisplayDate(end)}`
  if (start) return formatDisplayDate(start)
  return 'Dates to be set'
}
