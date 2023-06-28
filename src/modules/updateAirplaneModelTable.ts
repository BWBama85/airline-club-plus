import { calcFlightTime, calcFuelBurn, createLoadingElement, formatCurrency } from "~/helpers/utils"

const calculateCosts = (plane: Plane, flightDuration: number, plane_category: number, utilisation: number) => {
  const depreciationPercent = (100 / (plane.lifespan * 3)) * (1 + 2 * utilisation)
  const depreciationRate = Math.floor(plane.price * (depreciationPercent / 100) * utilisation)
  const maintenance = plane.capacity * 100 * utilisation
  const airport_fee = (500 * plane_category + plane.capacity * 10) * 2
  const crew_cost_per_hour = plane.capacity * (flightDuration / 60) * 12
  const inflight_cost_per_passenger = (20 + (8 * flightDuration) / 60) * plane.capacity * 2

  return { depreciationRate, maintenance, airport_fee, crew_cost_per_hour, inflight_cost_per_passenger }
}

const calculateUtilisation = (flightDuration: number, turnaroundTime: number) => {
  const MAX_FLIGHT_MINUTES = 4 * 24 * 60
  const totalTripTime = (flightDuration + turnaroundTime) * 2
  const frequency = Math.floor(MAX_FLIGHT_MINUTES / totalTripTime)
  const flightTime = frequency * totalTripTime
  const availableFlightMinutes = MAX_FLIGHT_MINUTES - flightTime
  const utilisation = flightTime / MAX_FLIGHT_MINUTES
  const planeUtilisation = (MAX_FLIGHT_MINUTES - availableFlightMinutes) / MAX_FLIGHT_MINUTES

  return { utilisation, planeUtilisation, frequency }
}

function createCellContents(modelOwnerInfo: Plane): string[] {
  let cellContent = modelOwnerInfo.isFavorite
    ? `${modelOwnerInfo.name}<img src='assets/images/icons/heart.png' height='10px'>`
    : modelOwnerInfo.name

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

function createRowElement(modelOwnerInfo: Plane, isOwned: boolean) {
  const row = document.createElement("div")
  row.className = "table-row clickable"
  row.setAttribute("data-model-id", modelOwnerInfo.id.toString())
  row.style.background = isOwned ? "#465b65" : ""
  row.onclick = () => window.selectAirplaneModel(window.loadedModelsById[modelOwnerInfo.id])
  return row
}

// This function checks if any airplanes are assigned, available, or constructing.
export const isModelOwned = (modelOwnerInfo: Plane) =>
  modelOwnerInfo.assignedAirplanes.length +
    modelOwnerInfo.availableAirplanes.length +
    modelOwnerInfo.constructingAirplanes.length !==
  0

// This function checks if a plane is valid based on CPP, max capacity, and in-use value.
export const isValidModel = (modelOwnerInfo: Plane, min_capacity: number, min_circulation: number) =>
  modelOwnerInfo.cpp !== -1 && modelOwnerInfo.max_capacity >= min_capacity && modelOwnerInfo.in_use >= min_circulation

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

/**
 * Creates a comparison function for sorting objects based on a given property.
 * The comparison function can be used directly in Array.prototype.sort().
 * If the values of the property in the objects are arrays, it sorts based on their lengths.
 * If the `ascending` parameter is false, it sorts in descending order, otherwise it sorts in ascending order.
 *
 * @param {string} property - The name of the property to sort the objects by.
 * @param {boolean} [ascending=true] - Indicates whether the sort order should be ascending (default) or descending.
 * @returns {(a: SortableObject, b: SortableObject) => number} - A comparison function that can be used in Array.prototype.sort().
 */
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

export async function updateAirplaneModelTable(sortProperty: string, sortOrder: string): Promise<void> {
  const distance = Number((document.getElementById("fightRange") as HTMLInputElement).value)
  const runway = Number((document.getElementById("runway") as HTMLInputElement).value)
  const min_capacity = Number((document.getElementById("min_capacity") as HTMLInputElement).value)
  const min_circulation = Number((document.getElementById("min_circulation") as HTMLInputElement).value)
  const use_flight_total = (document.getElementById("fuel_total") as HTMLInputElement).checked
  const airplaneModelTable = document.getElementById("airplaneModelTable")

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
    if (plane.range < distance || plane.runwayRequirement > runway) {
      plane.cpp = -1
      plane.max_rotation = -1
      continue
    }

    const plane_category = airplaneTypeMap[plane.airplaneType.toUpperCase()]
    const flightDuration = calcFlightTime(plane, distance)

    const { utilisation, frequency } = calculateUtilisation(flightDuration, plane.turnaroundTime)
    const { depreciationRate, maintenance, airport_fee, crew_cost_per_hour, inflight_cost_per_passenger } =
      calculateCosts(plane, flightDuration, plane_category, utilisation)

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
  console.log(sortProperty, sortOrder)
  //sort the list
  window.loadedModelsOwnerInfo.sort(sortByProperty(sortProperty, sortOrder == "ascending"))
  console.log(sortProperty, sortOrder)

  var childElements = airplaneModelTable.querySelectorAll("div.table-row")

  childElements.forEach(function (child) {
    airplaneModelTable.removeChild(child)
  })

  let modelOwnerInfo: Plane
  for (modelOwnerInfo of Object.values(window.loadedModelsOwnerInfo)) {
    modelOwnerInfo.in_use = modelOwnerInfo.in_use || 0

    const isOwned = isModelOwned(modelOwnerInfo)

    if (!isValidModel(modelOwnerInfo, min_capacity, min_circulation)) {
      continue
    }

    const row = createRowElement(modelOwnerInfo, isOwned)
    const cells = createCellContents(modelOwnerInfo)

    populateTableCells(row, cells, modelOwnerInfo.fuel_total_info)

    airplaneModelTable.appendChild(row)
  }
}
