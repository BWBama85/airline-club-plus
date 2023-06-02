import { refreshLinkDetails } from "~/modules/refreshLinkDetails"
import type { Link } from "~types/types"

export function populateDerivedFieldsOnLink(link: Link): void {
  link.totalCapacity = link.capacity.economy + link.capacity.business + link.capacity.first
  link.totalCapacityHistory = link.capacityHistory.economy + link.capacityHistory.business + link.capacityHistory.first
  link.totalPassengers = link.passengers.economy + link.passengers.business + link.passengers.first
  link.totalLoadFactor =
    link.totalCapacityHistory > 0 ? Math.round((link.totalPassengers / link.totalCapacityHistory) * 100) : 0
  let assignedModel
  if (link.assignedAirplanes && link.assignedAirplanes.length > 0) {
    assignedModel = link.assignedAirplanes[0].airplane.name
  } else {
    assignedModel = "-"
  }
  link.model = assignedModel //so this can be sorted

  link.profitMarginPercent = link.revenue === 0 ? 0 : ((link.profit + link.revenue) / link.revenue) * 100

  link.profitMargin =
    link.profitMarginPercent > 100 ? link.profitMarginPercent - 100 : (100 - link.profitMarginPercent) * -1

  link.profitPerPax = link.totalPassengers === 0 ? 0 : link.profit / link.totalPassengers

  link.profitPerFlight = link.profit / link.frequency
  link.profitPerHour = link.profit / link.duration
}

export function fadeIn(el: HTMLElement, display: string = "block"): void {
  el.style.opacity = "0"
  el.style.display = display

  function fade(): void {
    let val = parseFloat(el.style.opacity)
    val += 0.1
    if (val <= 1) {
      el.style.opacity = val.toString()
      requestAnimationFrame(fade)
    }
  }

  fade()
}

export function plotHistory(linkConsumptions) {
  window.plotLinkCharts(linkConsumptions)
  const linkHistoryDetails = document.getElementById("linkHistoryDetails")
  if (linkHistoryDetails) {
    linkHistoryDetails.style.display = "block"
  }
}

export function getLoadFactorsFor(consumption: Link): Record<string, number | string> {
  const factor: Record<string, number | string> = {}
  for (let key in consumption.capacity) {
    factor[key] = getFactorPercent(consumption, key) || "-"
  }
  return factor
}

export function getFactorPercent(consumption: Link, subType: string): number | null {
  return consumption.capacity[subType] > 0
    ? (consumption.soldSeats[subType] / consumption.capacity[subType]) * 100
    : null
}

export function averageFromSubKey(array: any[], ...subKeys: string[]): number {
  return array.map((obj) => _seekSubVal(obj, ...subKeys)).reduce((sum, val) => (sum += val || 0), 0) / array.length
}

export function _seekSubVal(val: any, ...subKeys: string[]): any {
  if (subKeys.length === 0) {
    return val
  }
  return _seekSubVal(val[subKeys[0]], ...subKeys.slice(1))
}

export function getShortModelName(airplaneName: string): string {
  const sections = airplaneName.trim().split(" ").slice(1)

  return sections
    .map((str) =>
      str.includes("-") || str.length < 4 || /^[A-Z0-9\-]+[a-z]{0,4}$/.test(str) ? str : str[0].toUpperCase()
    )
    .join(" ")
}

export function selectLinkFromTable(row: HTMLDivElement, linkId: number): void {
  window.selectedLink = linkId

  const siblings = Array.from(row.parentElement?.children ?? [])
  siblings.forEach((sibling) => sibling.classList.remove("selected"))
  row.classList.add("selected")

  refreshLinkDetails(linkId)
}
