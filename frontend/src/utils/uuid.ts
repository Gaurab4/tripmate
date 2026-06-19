import { validate as validateUuid } from 'uuid'

export function isValidUUID(value: string | undefined): value is string {
  return typeof value === 'string' && validateUuid(value)
}
