import type { PricingBreakdown, PricingRequest } from './types'

function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
  return diff
}

function monthFromDate(date: string): number {
  return new Date(date).getMonth() + 1
}

function seasonalMultiplier(startDate: string): number {
  const month = monthFromDate(startDate)
  if (month >= 6 && month <= 9) return 0.8
  if (month >= 10 && month <= 12) return 1.3
  return 1
}

function weekendMultiplier(startDate: string): number {
  const day = new Date(startDate).getDay()
  return day === 0 ? 1.1 : 1
}

function urgencyMultiplier(noticeHours: number): number {
  return noticeHours < 24 ? 1.25 : 1
}

function distanceCharge(distanceKm: number): number {
  if (distanceKm <= 50) return 0
  const extraBands = Math.ceil((distanceKm - 50) / 10)
  return extraBands * 500
}

function transportBase(transportClass: PricingRequest['transportClass']): number {
  if (transportClass === 'oversize') return 15000
  if (transportClass === 'heavy') return 9000
  return 2000
}

function gst(totalBeforeTax: number, interstate: boolean): number {
  return totalBeforeTax * (interstate ? 0.18 : 0.18)
}

export function calculateManagedMarketplacePrice(request: PricingRequest): PricingBreakdown {
  const days = daysBetween(request.startDate, request.endDate)
  const seasonal = seasonalMultiplier(request.startDate)
  const weekend = weekendMultiplier(request.startDate)
  const urgency = urgencyMultiplier(request.noticeHours)
  const b2bProjectDiscount = request.bookingMode === 'b2b' ? 0.7 : 1

  const rentalSubtotal = Math.round(request.baseRate * days * seasonal * weekend * urgency * b2bProjectDiscount)
  const platformCommission = Math.round(rentalSubtotal * 0.1)
  const logisticsAndProcessingFee = Math.round(rentalSubtotal * 0.05)
  const mandatoryDeliveryFee = transportBase(request.transportClass) + distanceCharge(request.distanceKm)
  const nightDeliverySurcharge = request.nightDelivery ? 1800 : 0

  const operatorAssignmentFee = request.includeOperator ? 1800 * days : 0
  const operatorPlatformShare = Math.round(operatorAssignmentFee * 0.2)
  const damageProtectionFee = request.includeDamageProtection ? Math.round(rentalSubtotal * 0.08) : 0
  const prioritySupportFee = request.includePrioritySupport ? 500 : 0
  const fuelTopUpFee = request.includeFuelTopUp ? Math.round(700 * days * 1.18) : 0

  const totalBeforeTax =
    rentalSubtotal +
    platformCommission +
    logisticsAndProcessingFee +
    mandatoryDeliveryFee +
    nightDeliverySurcharge +
    operatorAssignmentFee +
    damageProtectionFee +
    prioritySupportFee +
    fuelTopUpFee

  const gstAmount = Math.round(gst(totalBeforeTax, request.city !== 'Mumbai'))
  const total = totalBeforeTax + gstAmount
  const advancePayable = Math.round(total * 0.2)
  const fullPayDiscount = Math.round(total * 0.05)
  const fullPayAmount = total - fullPayDiscount

  return {
    rentalSubtotal,
    platformCommission,
    logisticsAndProcessingFee,
    mandatoryDeliveryFee,
    nightDeliverySurcharge,
    operatorAssignmentFee,
    operatorPlatformShare,
    damageProtectionFee,
    prioritySupportFee,
    fuelTopUpFee,
    gstAmount,
    total,
    advancePayable,
    fullPayDiscount,
    fullPayAmount,
    revenueStreams: [
      { label: 'Transaction Commission', amount: platformCommission },
      { label: 'Logistics & Delivery', amount: mandatoryDeliveryFee + nightDeliverySurcharge },
      { label: 'Value-Added Services', amount: operatorPlatformShare + damageProtectionFee + prioritySupportFee + fuelTopUpFee },
    ],
  }
}
