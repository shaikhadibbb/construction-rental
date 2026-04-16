import type { AvailabilityWindow, EquipmentUnit, OperatorProfile } from './types'

export const equipmentUnits: EquipmentUnit[] = [
  {
    id: 'eq-001',
    sku: 'JCB-3DX-001',
    model: 'JCB 3DX Super Excavator',
    category: 'Excavator',
    status: 'available',
    depotId: 'dep-mumbai',
    machineAgeYears: 2,
    hourMeterReading: 690,
    lastServiceDate: '2026-04-01',
    insuranceValidity: '2027-03-31',
    rcBookNumber: 'MH-01-CR-4571',
    baseDailyRate: 2500,
    transportClass: 'heavy',
  },
  {
    id: 'eq-002',
    sku: 'LBR-50T-014',
    model: 'Liebherr 50T Crane',
    category: 'Crane',
    status: 'rented',
    depotId: 'dep-delhi',
    machineAgeYears: 4,
    hourMeterReading: 1420,
    lastServiceDate: '2026-03-22',
    insuranceValidity: '2027-02-28',
    rcBookNumber: 'DL-12-CR-1199',
    baseDailyRate: 11000,
    transportClass: 'oversize',
  },
  {
    id: 'eq-003',
    sku: 'TH-EX200-009',
    model: 'Tata Hitachi EX200',
    category: 'Excavator',
    status: 'available',
    depotId: 'dep-bangalore',
    machineAgeYears: 3,
    hourMeterReading: 1020,
    lastServiceDate: '2026-03-18',
    insuranceValidity: '2026-12-31',
    rcBookNumber: 'KA-51-CR-2301',
    baseDailyRate: 6800,
    transportClass: 'heavy',
  },
]

export const availabilityWindows: AvailabilityWindow[] = [
  { equipmentId: 'eq-002', startDate: '2026-04-12', endDate: '2026-04-20', reason: 'booking' },
  { equipmentId: 'eq-001', startDate: '2026-04-25', endDate: '2026-04-27', reason: 'maintenance' },
]

export const operators: OperatorProfile[] = [
  {
    id: 'op-001',
    name: 'Rajesh Yadav',
    licenseNumber: 'MH-OP-88211',
    yearsExperience: 8,
    languages: ['Hindi', 'Marathi'],
    specialization: 'Excavator',
    isPoliceVerified: true,
    rating: 4.8,
    isAvailable: true,
  },
  {
    id: 'op-002',
    name: 'Aman Khan',
    licenseNumber: 'DL-OP-22018',
    yearsExperience: 6,
    languages: ['Hindi', 'English'],
    specialization: 'Crane',
    isPoliceVerified: true,
    rating: 4.7,
    isAvailable: true,
  },
]
