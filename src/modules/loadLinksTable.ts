// Import necessary constants and modules
import { Constants } from "~/helpers/constants"
import { updateLinksTable } from "~/modules/updateLinksTable"
import { fetchData } from "~helpers/apiService"

// Function to calculate and populate derived fields on each link object
function populateDerivedFieldsOnLink(link: Link): void {
  // Sum total capacities from different classes
  link.totalCapacity = link.capacity.economy + link.capacity.business + link.capacity.first

  // Sum total capacity history from different classes
  link.totalCapacityHistory = link.capacityHistory.economy + link.capacityHistory.business + link.capacityHistory.first

  // Sum total passengers from different classes
  link.totalPassengers = link.passengers.economy + link.passengers.business + link.passengers.first

  // Calculate total load factor, avoiding division by zero
  link.totalLoadFactor =
    link.totalCapacityHistory > 0 ? Math.round((link.totalPassengers / link.totalCapacityHistory) * 100) : 0

  // Store the model of the first assigned airplane, or "-" if none assigned
  let assignedModel
  if (link.assignedAirplanes && link.assignedAirplanes.length > 0) {
    assignedModel = link.assignedAirplanes[0].airplane.name
  } else {
    assignedModel = "-"
  }
  // Assign the airplane model to the link for easier sorting
  link.model = assignedModel

  // Calculate profit margin percentage, avoiding division by zero
  link.profitMarginPercent = link.revenue === 0 ? 0 : ((link.profit + link.revenue) / link.revenue) * 100

  // Adjust the profit margin to a standard scale
  link.profitMargin =
    link.profitMarginPercent > 100 ? link.profitMarginPercent - 100 : (100 - link.profitMarginPercent) * -1

  // Calculate profit per passenger, avoiding division by zero
  link.profitPerPax = link.totalPassengers === 0 ? 0 : link.profit / link.totalPassengers

  // Calculate profit per flight and per hour
  link.profitPerFlight = link.profit / link.frequency
  link.profitPerHour = link.profit / link.duration
}

// Function to update the header of the custom link table
function updateCustomLinkTableHeader(): void {
  const linksTableSortHeader = window.document.getElementById("linksTableSortHeader")

  // Exit if the header already contains the correct number of children
  if (linksTableSortHeader && linksTableSortHeader.children.length === 15) {
    return
  }

  // Function to apply width to specific elements
  const applyWidths = (selector: string, width: string): void => {
    const elements = window.document.querySelectorAll(selector)
    elements.forEach((element: HTMLElement) => {
      element.style.width = width
    })
  }

  // Apply specified widths to elements
  applyWidths("#linksCanvas .mainPanel", "62%")
  applyWidths("#linksCanvas .sidePanel", "38%")
  applyWidths("#canvas .mainPanel", "62%")
  applyWidths("#canvas .sidePanel", "38%")

  // Function to generate cell HTML for headers
  const generateCellHTML = ({ className, style, sortProperty, sortOrder, onClick, title, content }) => `
  <div class="${className}" style="${style}" data-sort-property="${sortProperty}" data-sort-order="${sortOrder}" onclick="${onClick}" title="${title}">${content}</div>
`
  // Set the innerHTML of linksTableSortHeader
  if (linksTableSortHeader) {
    linksTableSortHeader.innerHTML = Constants.TABLE_HEADERS.map(generateCellHTML).join("")
  }

  // Apply style to table header cells
  const linksTableHeader = window.document.querySelector("#linksTable .table-header")
  if (linksTableHeader) {
    linksTableHeader.innerHTML = Constants.TABLE_HEADERS.map(
      (header) => `<div class="cell" style="width: ${header.style}; border-bottom: none;"></div>`
    ).join("")
  }
}

// Function to load link table data
export async function loadLinksTable(): Promise<void> {
  try {
    // Throw error if active airline is not set
    if (!window.activeAirline) throw new Error("Active airline not set")

    // Fetch data from API
    const links: Link[] = await fetchData(`airlines/${window.activeAirline.id}/links-details`)

    // Update custom link table header
    updateCustomLinkTableHeader()

    // Update loaded links
    window.updateLoadedLinks(links)

    // Populate derived fields on each link
    links.forEach((link, key) => populateDerivedFieldsOnLink(link))

    const linksTableSortHeader = window.document.getElementById("linksTableSortHeader")

    // Throw error if necessary element is not found
    if (!linksTableSortHeader) throw new Error("linksTableSortHeader element not found")

    // Get selected sort header
    const selectedSortHeader = Array.from(linksTableSortHeader.getElementsByClassName("cell")).find((element) =>
      element.classList.contains("selected")
    )

    // Update link table if a sort header is selected
    if (selectedSortHeader) {
      const sortProperty = selectedSortHeader.getAttribute("data-sort-property")
      const sortOrder = selectedSortHeader.getAttribute("data-sort-order")

      updateLinksTable(sortProperty, sortOrder)
    }
  } catch (error) {
    // Log error in console
    console.error(error)
  }
}
