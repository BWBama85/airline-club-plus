// Import necessary functions and modules
import { calcFlightTime, calcFuelBurn, createLoadingElement, formatCurrency } from "~/helpers/utils"

// Function to calculate the costs related to an airplane
const calculateCosts = (plane: Plane, flightDuration: number, plane_category: number, utilisation: number) => {
  const depreciationPercent = (100 / (plane.lifespan * 3)) * (1 + 2 * utilisation) // Calculate the depreciation rate
  const depreciationRate = Math.floor(plane.price * (depreciationPercent / 100) * utilisation) // Calculate the depreciation rate
  const maintenance = plane.capacity * 100 * utilisation // Calculate the maintenance costs
  const airport_fee = (500 * plane_category + plane.capacity * 10) * 2 // Calculate the airport fees
  const crew_cost_per_hour = plane.capacity * (flightDuration / 60) * 12 // Calculate the crew cost per hour
  const inflight_cost_per_passenger = (20 + (8 * flightDuration) / 60) * plane.capacity * 2 // Calculate the in-flight costs per passenger
  
  // Return the calculated costs
  return { depreciationRate, maintenance, airport_fee, crew_cost_per_hour, inflight_cost_per_passenger }
}

// Function to calculate the utilisation of an airplane
const calculateUtilisation = (flightDuration: number, turnaroundTime: number) => {
  const MAX_FLIGHT_MINUTES = 4 * 24 * 60 // Define the maximum number of flight minutes
  const totalTripTime = (flightDuration + turnaroundTime) * 2 // Calculate the total trip time
  const frequency = Math.floor(MAX_FLIGHT_MINUTES / totalTripTime) // Calculate the frequency of flights
  const flightTime = frequency * totalTripTime // Calculate the flight time
  const availableFlightMinutes = MAX_FLIGHT_MINUTES - flightTime // Calculate the available flight minutes
  const utilisation = flightTime / MAX_FLIGHT_MINUTES // Calculate the utilisation
  const planeUtilisation = (MAX_FLIGHT_MINUTES - availableFlightMinutes) / MAX_FLIGHT_MINUTES // Calculate the plane utilisation

  // Return the calculated utilisation values
  return { utilisation, planeUtilisation, frequency }
}

// Function to create cell contents
function createCellContents(modelOwnerInfo: Plane): string[] {
  // Check if the model is a favorite and create the cell content accordingly
  let cellContent = modelOwnerInfo.isFavorite
    ? `${modelOwnerInfo.name}<img src='assets/images/icons/heart.png' height='10px'>`
    : modelOwnerInfo.name

  // Return the created cell contents
  return [
    cellContent,
    modelOwnerInfo.family,
    `${formatCurrency(modelOwnerInfo.price)}`,
    `${modelOwnerInfo.capacity} (${modelOwnerInfo.capacity * modelOwnerInfo.max_rotation})`,
    `${modelOwnerInfo.range} km`,
    modelOwnerInfo.fuelBurn.toString(),
    `${modelOwnerInfo.lifespan / 52} yrs`,
    `${modelOwnerInfo.speed} km/h`,
    `${modelOwnerInfo.runwayRequirement} m`,
    `${modelOwnerInfo.assignedAirplanes.length}/${modelOwnerInfo.availableAirplanes.length}/${modelOwnerInfo.constructingAirplanes.length}`,
    modelOwnerInfo.max_rotation.toString(),
    `${formatCurrency(Math.round(modelOwnerInfo.cpp))}`,
    modelOwnerInfo.in_use.toString()
  ]
}

// Function to create a row element
function createRowElement(modelOwnerInfo: Plane, isOwned: boolean) {
  const row = document.createElement("div") // Create the row
  row.className = "table-row clickable"
  row.setAttribute("data-model-id", modelOwnerInfo.id.toString())
  row.style.background = isOwned ? "#465b65" : "" // Set the row background if the model is owned
  row.onclick = () => window.selectAirplaneModel(window.loadedModelsById[modelOwnerInfo.id]) // Set the onclick event handler for the row
  return row
}

// Check if the model is owned by the user -- Checks if airplanes are assigned, available, or constructing.
export const isModelOwned = (modelOwnerInfo: Plane) =>
  modelOwnerInfo.assignedAirplanes.length +
    modelOwnerInfo.availableAirplanes.length +
    modelOwnerInfo.constructingAirplanes.length !==
  0

// Check if the model is valid -- Checks if a plane is valid based on CPP, max capacity, and in-use value.
export const isValidModel = (modelOwnerInfo: Plane, min_capacity: number, min_circulation: number) =>
  modelOwnerInfo.cpp !== -1 && modelOwnerInfo.max_capacity >= min_capacity && modelOwnerInfo.in_use >= min_circulation

// Function to populate table cells
const populateTableCells = (row: HTMLElement, cells: string[], title: string) => {
  cells.forEach((content, index) => {
    const cell = document.createElement("div")
    cell.className = "cell"
    cell.innerHTML = content
    if (index === 11) {
      cell.setAttribute("title", title)
    }
    row.appendChild(cell)
  })
}

// Function to create a comparison function for sorting 
// --
// Creates a comparison function for sorting objects based on a given property.
// The comparison function can be used directly in Array.prototype.sort().
// If the values of the property in the objects are arrays, it sorts based on their lengths.
// If the `ascending` parameter is false, it sorts in descending order, otherwise it sorts in ascending order.

// @param {string} property - The name of the property to sort the objects by.
// @param {boolean} [ascending=true] - Indicates whether the sort order should be ascending (default) or descending.
// @returns {(a: SortableObject, b: SortableObject) => number} - A comparison function that can be used in Array.prototype.sort().

function sortByProperty(property: string, ascending: boolean = true): (a: SortableObject, b: SortableObject) => number {
  const sortOrder = ascending ? 1 : -1

  return function (a: SortableObject, b: SortableObject): number {
    let aVal = a[property]
    let bVal = b[property]
    if (Array.isArray(aVal) && Array.isArray(bVal)) {
      aVal = aVal.length
      bVal = bVal.length
    }
    const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return result * sortOrder
  }
}

// Async function to update the airplane model table
export async function updateAirplaneModelTable(sortProperty: string, sortOrder: string): Promise<void> {
  // Get all necessary user input values
  const distance = Number((document.getElementById("fightRange") as HTMLInputElement).value)
  const runway = Number((document.getElementById("runway") as HTMLInputElement).value)
  const min_capacity = Number((document.getElementById("min_capacity") as HTMLInputElement).value)
  const min_circulation = Number((document.getElementById("min_circulation") as HTMLInputElement).value)
  const use_flight_total = (document.getElementById("fuel_total") as HTMLInputElement).checked
  const airplaneModelTable = document.getElementById("airplaneModelTable")

  // Define the airplane type map
  const airplaneTypeMap = {
    LIGHT: 1,
    SMALL: 1,
    REGIONAL: 3,
    MEDIUM: 8,
    LARGE: 12,
    "EXTRA LARGE": 15,
    X_LARGE: 15,
    JUMBO: 18,
    SUPERSONIC: 12
  }
  
  let plane: Plane
  for (plane of Object.values(window.loadedModelsOwnerInfo)) {
    // Check if the range is enough and the runway requirement is not too high
    if (plane.range < distance || plane.runwayRequirement > runway) {
      plane.cpp = -1
      plane.max_rotation = -1
      continue
    }

    const plane_category = airplaneTypeMap[plane.airplaneType.toUpperCase()]
    const flightDuration = calcFlightTime(plane, distance)

    // Calculate the utilization and frequency
    const { utilisation, frequency } = calculateUtilisation(flightDuration, plane.turnaroundTime)
    // Calculate the costs
    const { depreciationRate, maintenance, airport_fee, crew_cost_per_hour, inflight_cost_per_passenger } =
      calculateCosts(plane, flightDuration, plane_category, utilisation)

    // Update the plane information
    plane.max_rotation = frequency
    plane.fbpf = calcFuelBurn(plane, distance)
    plane.fbpp = plane.fbpf / plane.capacity
    plane.fbpw = plane.fbpf * plane.max_rotation
    plane.fuel_total =
      (plane.fbpf * 0.08 + airport_fee + inflight_cost_per_passenger + crew_cost_per_hour) * plane.max_rotation +
      depreciationRate +
      maintenance
    plane.cpp = plane.fuel_total / (plane.capacity * plane.max_rotation)
    plane.max_capacity = plane.capacity * plane.max_rotation
    plane.fuel_total_info =
      "Total Frequency Cost: $" +
      formatCurrency(Math.round(plane.fuel_total)) +
      " / Per Flight: $" +
      formatCurrency(Math.round(plane.cpp * plane.capacity))

    // Check if the plane is in use
    if (plane.in_use === undefined) {
      plane.in_use = -1

      const loadingElement = createLoadingElement()
      const airplaneModelTable = document.getElementById("airplaneModelTable")
      airplaneModelTable?.appendChild(loadingElement)

      try {
        await window.loadAirplaneModelStats(plane, { totalOnly: true })
      } finally {
        loadingElement.parentNode.removeChild(loadingElement)
      }
    }
  }

  // If there is no sort property and sort order, get the default ones
  if (!sortProperty && !sortOrder) {
    const selectedSortHeader = document.querySelector("#airplaneModelSortHeader .cell.selected") as HTMLElement
    sortProperty = selectedSortHeader.getAttribute("data-sort-property")
    if (sortProperty === "capacity") {
      sortProperty = "max_capacity"
    } else if (sortProperty === "cpp" && use_flight_total) {
      sortProperty = "fuel_total"
    }
    sortOrder = selectedSortHeader.getAttribute("data-sort-order")
  }
  // Sort the list
  window.loadedModelsOwnerInfo.sort(sortByProperty(sortProperty, sortOrder == "ascending"))

  // Clear the existing rows
  var childElements = airplaneModelTable.querySelectorAll("div.table-row")
  
  childElements.forEach(function (child) {
    airplaneModelTable.removeChild(child)
  })

  let modelOwnerInfo: Plane
  for (modelOwnerInfo of Object.values(window.loadedModelsOwnerInfo)) {
    // If the model is not in use, set it to 0
    modelOwnerInfo.in_use = modelOwnerInfo.in_use || 0

    const isOwned = isModelOwned(modelOwnerInfo)

    // If the model is not valid, skip it
    if (!isValidModel(modelOwnerInfo, min_capacity, min_circulation)) {
      continue
    }

    // Create a row element and populate its cells
    const row = createRowElement(modelOwnerInfo, isOwned)
    const cells = createCellContents(modelOwnerInfo)

    populateTableCells(row, cells, modelOwnerInfo.fuel_total_info)

    // Append the row to the table
    airplaneModelTable.appendChild(row)
  }
}
