export type EquipmentStatus = 'available' | 'rented' | 'maintenance'

export type City = 'Mumbai' | 'Delhi' | 'Bangalore' | 'Pune' | 'Hyderabad'

export type BookingMode = 'b2c' | 'b2b'

export interface Depot {
  id: string
  city: City
  area: string
  latitude: number
  longitude: number
  serviceRadiusKm: number
}

export interface EquipmentUnit {
  id: string
  sku: string
  model: string
  category: 'Excavator' | 'Crane' | 'Forklift' | 'Loader' | 'Compactor' | 'Boom Lift' | 'Generator'
  status: EquipmentStatus
  depotId: string
  machineAgeYears: number
  hourMeterReading: number
  lastServiceDate: string
  insuranceValidity: string
  rcBookNumber: string
  baseDailyRate: number
  transportClass: 'light' | 'heavy' | 'oversize'
}

export interface AvailabilityWindow {
  equipmentId: string
  startDate: string
  endDate: string
  reason: 'booking' | 'maintenance'
}

export interface OperatorProfile {
  id: string
  name: string
  licenseNumber: string
  yearsExperience: number
  languages: string[]
  specialization: 'Crane' | 'Excavator' | 'Forklift'
  isPoliceVerified: boolean
  rating: number
  isAvailable: boolean
}

export interface PricingRequest {
  city: City
  category: EquipmentUnit['category']
  baseRate: number
  startDate: string
  endDate: string
  distanceKm: number
  transportClass: EquipmentUnit['transportClass']
  includeOperator: boolean
  includeDamageProtection: boolean
  includePrioritySupport: boolean
  includeFuelTopUp: boolean
  nightDelivery: boolean
  noticeHours: number
  bookingMode: BookingMode
}

export interface PricingBreakdown {
  rentalSubtotal: number
  platformCommission: number
  logisticsAndProcessingFee: number
  mandatoryDeliveryFee: number
  nightDeliverySurcharge: number
  operatorAssignmentFee: number
  operatorPlatformShare: number
  damageProtectionFee: number
  prioritySupportFee: number
  fuelTopUpFee: number
  gstAmount: number
  total: number
  advancePayable: number
  fullPayDiscount: number
  fullPayAmount: number
  revenueStreams: Array<{ label: string; amount: number }>
}
