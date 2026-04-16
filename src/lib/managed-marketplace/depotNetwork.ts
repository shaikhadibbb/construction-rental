import type { City, Depot } from './types'

export const DEPOTS: Depot[] = [
  { id: 'dep-mumbai', city: 'Mumbai', area: 'Andheri', latitude: 19.1136, longitude: 72.8697, serviceRadiusKm: 50 },
  { id: 'dep-delhi', city: 'Delhi', area: 'Noida', latitude: 28.5355, longitude: 77.391, serviceRadiusKm: 50 },
  { id: 'dep-bangalore', city: 'Bangalore', area: 'Whitefield', latitude: 12.9698, longitude: 77.75, serviceRadiusKm: 50 },
  { id: 'dep-pune', city: 'Pune', area: 'Chakan', latitude: 18.7635, longitude: 73.8625, serviceRadiusKm: 50 },
  { id: 'dep-hyderabad', city: 'Hyderabad', area: 'Gachibowli', latitude: 17.4401, longitude: 78.3489, serviceRadiusKm: 50 },
]

const CITY_INDEX: Record<City, Depot> = {
  Mumbai: DEPOTS[0],
  Delhi: DEPOTS[1],
  Bangalore: DEPOTS[2],
  Pune: DEPOTS[3],
  Hyderabad: DEPOTS[4],
}

export function getDepotForCity(city: City): Depot {
  return CITY_INDEX[city]
}

export function isWithinServiceRadius(city: City, distanceKm: number): boolean {
  return distanceKm <= getDepotForCity(city).serviceRadiusKm
}
