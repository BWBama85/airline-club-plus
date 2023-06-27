export function addInputCells(): void {
  const hangarDiv = document.querySelector('div[data-type="hangar"]')

  if (hangarDiv && !hangarDiv.classList.contains("selected")) {
    const mainPanel: HTMLInputElement = document.querySelector(
      "#airplaneCanvas .mainPanel .section .table .table-header:first-child"
    )

    // Remove the style attribute
    hangarDiv.removeAttribute("style")

    const distanceDiv = document.createElement("div")
    const runwayDiv = document.createElement("div")
    const minCapacityDiv = document.createElement("div")
    const minCirculationDiv = document.createElement("div")
    const selectionDiv = document.createElement("div")

    distanceDiv.classList.add("cell", "detailsSelection")
    runwayDiv.classList.add("cell", "detailsSelection")
    minCapacityDiv.classList.add("cell", "detailsSelection")
    minCirculationDiv.classList.add("cell", "detailsSelection")
    selectionDiv.classList.add("cell", "detailsSelection")

    selectionDiv.style.minWidth = "160px"
    selectionDiv.style.textAlign = "right"

    distanceDiv.innerHTML = 'Distance: <input type="text" id="fightRange" value="1000" />'
    runwayDiv.innerHTML = 'Runway length: <input type="text" id="runway" value="3600" />'
    minCapacityDiv.innerHTML = 'Min. Capacity: <input type="text" id="min_capacity" value="0" />'
    minCirculationDiv.innerHTML = 'Min. Circulation: <input type="text" id="min_circulation" value="0" />'
    selectionDiv.innerHTML = `
    <label for="fuel_total">Flight Fuel Total <input type="checkbox" id="fuel_total" /></label>
    `
    mainPanel.appendChild(distanceDiv)
    mainPanel.appendChild(runwayDiv)
    mainPanel.appendChild(minCapacityDiv)
    mainPanel.appendChild(minCirculationDiv)
    mainPanel.appendChild(selectionDiv)
  }
}

export function addTableHeaderCells(): void {
  const columnWidthPercents: number[] = [17, 12, 9, 7, 7, 7, 7, 9, 7, 6, 3, 5, 4]

  const airplaneModelSortHeader = document.getElementById("airplaneModelSortHeader")
  if (airplaneModelSortHeader) {
    const addCell = (sortProperty: string, content: string) => {
      const div = document.createElement("div")
      div.classList.add("cell", "clickable")
      div.setAttribute("data-sort-property", sortProperty)
      div.setAttribute("data-sort-order", "ascending")
      div.style.textAlign = "right"
      div.textContent = content
      div.setAttribute("onclick", "toggleAirplaneModelTableSortOrder($(this))")
      airplaneModelSortHeader.appendChild(div)
    }

    addCell("max_rotation", "⏲")
    addCell("cpp", "$/🧍")
    addCell("in_use", "#✈")
  }

  const headerCells = document.querySelectorAll("#airplaneModelSortHeader .cell")
  headerCells.forEach((headerCell, index) => {
    headerCell.setAttribute("style", `width: ${columnWidthPercents[index]}%`)
  })

  const airplaneModelTable = document.querySelector("#airplaneModelTable .table-header")
  if (airplaneModelTable) {
    let html = ""
    columnWidthPercents.forEach((width) => {
      html += `<div class="cell" style="width: ${width}%; border-bottom: none;"></div>`
    })
    airplaneModelTable.innerHTML = html
  }

  const totalOwnedElems = document.querySelectorAll('[data-sort-property="totalOwned"]')
  totalOwnedElems.forEach((elem) => {
    elem.textContent = "Owned"
    elem.setAttribute("style", "width: 6%;")
  })
}

export function setupNewDataFilterElements(): void {
  const newDataFilterElements: string[] = ["#fightRange", "#runway", "#min_capacity", "#min_circulation", "#fuel_total"]

  const elementRefs = newDataFilterElements.map((id) => document.querySelector(id))

  elementRefs.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.addEventListener("change", () => window.updateAirplaneModelTable(element.id, "descending"))
    }
  })
}

export const isModelOwned = (modelOwnerInfo: Plane) =>
  modelOwnerInfo.assignedAirplanes.length +
    modelOwnerInfo.availableAirplanes.length +
    modelOwnerInfo.constructingAirplanes.length !==
  0

export const isValidModel = (modelOwnerInfo: Plane, min_capacity: number, min_circulation: number) =>
  modelOwnerInfo.cpp !== -1 && modelOwnerInfo.max_capacity >= min_capacity && modelOwnerInfo.in_use >= min_circulation

export const calculateUtilisation = (flightDuration: number, turnaroundTime: number) => {
  const MAX_FLIGHT_MINUTES = 4 * 24 * 60
  const frequency = Math.floor(MAX_FLIGHT_MINUTES / ((flightDuration + turnaroundTime) * 2))
  const flightTime = frequency * 2 * (flightDuration + turnaroundTime)
  const availableFlightMinutes = MAX_FLIGHT_MINUTES - flightTime
  const utilisation = flightTime / (MAX_FLIGHT_MINUTES - availableFlightMinutes)
  const planeUtilisation = (MAX_FLIGHT_MINUTES - availableFlightMinutes) / MAX_FLIGHT_MINUTES
  return { utilisation, planeUtilisation, frequency }
}

export const calculateCosts = (plane: Plane, flightDuration: number, plane_category: number, utilisation: number) => {
  const decayRate = (100 / (plane.lifespan * 3)) * (1 + 2 * utilisation)
  const depreciationRate = Math.floor(plane.price * (decayRate / 100) * utilisation)
  const maintenance = plane.capacity * 100 * utilisation

  const airport_fee = (500 * plane_category + plane.capacity * 10) * 2
  const crew_cost = plane.capacity * (flightDuration / 60) * 12
  const inflight_cost = (20 + (8 * flightDuration) / 60) * plane.capacity * 2

  return { depreciationRate, maintenance, airport_fee, crew_cost, inflight_cost }
}
