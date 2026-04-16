import type { AvailabilityWindow, EquipmentUnit } from './types'

export function isDateRangeAvailable(
  unit: EquipmentUnit,
  startDate: string,
  endDate: string,
  windows: AvailabilityWindow[]
): boolean {
  if (unit.status === 'maintenance') return false

  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  if (end < start) return false

  return !windows.some(window => {
    if (window.equipmentId !== unit.id) return false
    const wStart = new Date(window.startDate).getTime()
    const wEnd = new Date(window.endDate).getTime()
    return start <= wEnd && end >= wStart
  })
}

export function nextAvailableDate(unit: EquipmentUnit, windows: AvailabilityWindow[]): string {
  const now = new Date()
  const relevant = windows
    .filter(window => window.equipmentId === unit.id)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())

  const latest = relevant.at(-1)
  if (!latest) return now.toISOString().slice(0, 10)

  const next = new Date(latest.endDate)
  next.setDate(next.getDate() + 1)
  return next.toISOString().slice(0, 10)
}

export function maintenanceDue(unit: EquipmentUnit): boolean {
  return unit.hourMeterReading % 100 >= 95
}
