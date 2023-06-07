import { refreshLinkDetails } from "~/modules/refreshLinkDetails"
import { updateLinksTable } from "~modules/updateLinksTable"

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

export function setActiveDiv(activeDiv: Element, callback?: () => void): boolean {
  if (!(activeDiv instanceof HTMLElement)) {
    return false
  }

  const parentElement = activeDiv.parentElement
  const existingActiveDivs = Array.from(parentElement?.children ?? []).filter((element) => {
    return element instanceof HTMLElement && getComputedStyle(element).clear !== "both"
  })

  if (!callback && activeDiv.dataset.initCallback) {
    callback = eval(activeDiv.dataset.initCallback) as () => void
    delete activeDiv.dataset.initCallback
  }

  if (existingActiveDivs.length > 0) {
    existingActiveDivs.forEach((existingDiv: HTMLElement) => existingDiv.classList.remove("active"))
    activeDiv.classList.add("active")
    existingActiveDivs.forEach((existingDiv: HTMLElement) => (existingDiv.style.display = "none"))
    fadeIn(activeDiv, 400, callback)
  } else {
    if (activeDiv.style.display === "block") {
      if (callback) {
        callback()
      }
      return false
    } else {
      Array.from(parentElement?.children ?? []).forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.display = "none"
        }
      })
      activeDiv.classList.add("active")
      fadeIn(activeDiv, 200, callback)
    }
  }

  if (parentElement && parentElement instanceof HTMLElement) {
    parentElement.style.display = "block"
  }
  return true
}

export function hideActiveDiv(activeDiv: Element): void {
  if (activeDiv instanceof HTMLElement && activeDiv.style.display === "block") {
    fadeOut(activeDiv, 200, () => {
      if (activeDiv.parentElement && activeDiv.parentElement instanceof HTMLElement) {
        activeDiv.parentElement.style.display = "none"
      }
    })
  }
}

export function fadeIn(element: Element, duration: number, callback?: () => void): void {
  if (!(element instanceof HTMLElement)) {
    return
  }

  const htmlElement = element as HTMLElement

  htmlElement.style.opacity = "0"
  htmlElement.style.display = "block"
  let start = performance.now()

  function step(timestamp: number): void {
    let progress = timestamp - start
    if (progress >= duration) {
      htmlElement.style.opacity = "1"
      if (callback) {
        callback()
      }
    } else {
      htmlElement.style.opacity = String(progress / duration)
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

export function fadeOut(element: Element, duration: number, callback?: () => void): void {
  if (!(element instanceof HTMLElement)) {
    return
  }

  const htmlElement = element as HTMLElement

  let start = performance.now()

  function step(timestamp: number): void {
    let progress = timestamp - start
    if (progress >= duration) {
      htmlElement.style.opacity = "0"
      htmlElement.style.display = "none"
      if (callback) {
        callback()
      }
    } else {
      htmlElement.style.opacity = String(1 - progress / duration)
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

export function plotHistory(linkConsumptions) {
  window.plotLinkCharts(linkConsumptions)
  const linkHistoryDetails = document.getElementById("linkHistoryDetails")
  if (linkHistoryDetails) {
    linkHistoryDetails.style.display = "block"
  }
}

export function getGradeStarsImgs(gradeValue: number): string {
  const fullStars = Math.floor(gradeValue / 2)
  const halfStar = gradeValue % 2
  let html = ""

  for (let i = 0; i < fullStars; i++) {
    html += "<img src='assets/images/icons/star.png'/>"
  }

  if (halfStar) {
    html += "<img src='assets/images/icons/star-half.png'/>"
  }

  for (let i = 0; i < 5 - fullStars - halfStar; i++) {
    html += "<img src='assets/images/icons/star-empty.png'/>"
  }

  return html
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
    ? Math.round((consumption.soldSeats[subType] / consumption.capacity[subType]) * 100)
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

export function toggleLinksTableSortOrder(sortHeader: HTMLElement): void {
  const sortOrder = sortHeader.getAttribute("data-sort-order")

  if (sortOrder === "ascending") {
    sortHeader.setAttribute("data-sort-order", "descending")
  } else {
    sortHeader.setAttribute("data-sort-order", "ascending")
  }

  Array.from(sortHeader.parentElement?.children ?? []).forEach((sibling) => {
    if (sibling !== sortHeader) {
      sibling.classList.remove("selected")
    }
  })

  sortHeader.classList.add("selected")

  const sortProperty = sortHeader.getAttribute("data-sort-property")
  const updatedSortOrder = sortHeader.getAttribute("data-sort-order")

  if (sortProperty && updatedSortOrder) {
    updateLinksTable(sortProperty, updatedSortOrder)
  }
}
