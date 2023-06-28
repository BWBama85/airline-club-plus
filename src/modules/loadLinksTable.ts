import { Constants } from "~/helpers/constants"
import { updateLinksTable } from "~/modules/updateLinksTable"
import { fetchData } from "~helpers/apiService"

function populateDerivedFieldsOnLink(link: Link): void {
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

function updateCustomLinkTableHeader(): void {
  const linksTableSortHeader = window.document.getElementById("linksTableSortHeader")
  if (linksTableSortHeader && linksTableSortHeader.children.length === 15) {
    return
  }

  const applyWidths = (selector: string, width: string): void => {
    const elements = window.document.querySelectorAll(selector)
    elements.forEach((element: HTMLElement) => {
      element.style.width = width
    })
  }

  applyWidths("#linksCanvas .mainPanel", "62%")
  applyWidths("#linksCanvas .sidePanel", "38%")
  applyWidths("#canvas .mainPanel", "62%")
  applyWidths("#canvas .sidePanel", "38%")

  const generateCellHTML = ({ className, style, sortProperty, sortOrder, onClick, title, content }) => `
  <div class="${className}" style="${style}" data-sort-property="${sortProperty}" data-sort-order="${sortOrder}" onclick="${onClick}" title="${title}">${content}</div>
`

  if (linksTableSortHeader) {
    linksTableSortHeader.innerHTML = Constants.TABLE_HEADERS.map(generateCellHTML).join("")
  }

  const linksTableHeader = window.document.querySelector("#linksTable .table-header")
  if (linksTableHeader) {
    linksTableHeader.innerHTML = Constants.TABLE_HEADERS.map(
      (header) => `<div class="cell" style="width: ${header.style}; border-bottom: none;"></div>`
    ).join("")
  }
}

export async function loadLinksTable(): Promise<void> {
  try {
    if (!window.activeAirline) throw new Error("Active airline not set")

    const links: Link[] = await fetchData(`airlines/${window.activeAirline.id}/links-details`)

    updateCustomLinkTableHeader()
    window.updateLoadedLinks(links)

    links.forEach((link, key) => populateDerivedFieldsOnLink(link))

    const linksTableSortHeader = window.document.getElementById("linksTableSortHeader")
    if (!linksTableSortHeader) throw new Error("linksTableSortHeader element not found")

    const selectedSortHeader = Array.from(linksTableSortHeader.getElementsByClassName("cell")).find((element) =>
      element.classList.contains("selected")
    )

    if (selectedSortHeader) {
      const sortProperty = selectedSortHeader.getAttribute("data-sort-property")
      const sortOrder = selectedSortHeader.getAttribute("data-sort-order")

      updateLinksTable(sortProperty, sortOrder)
    }
  } catch (error) {
    console.error(error)
  }
}
