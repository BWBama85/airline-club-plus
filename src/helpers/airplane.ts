export function addInputCells(): void {
  const mainPanel: HTMLInputElement = document.querySelector(
    "#airplaneCanvas .mainPanel .section .table .table-header:first-child"
  )

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
    <label for="use_flight_total">Flight Fuel Total <input type="checkbox" id="use_flight_total" /></label>
    `
  mainPanel.appendChild(distanceDiv)
  mainPanel.appendChild(runwayDiv)
  mainPanel.appendChild(minCapacityDiv)
  mainPanel.appendChild(minCirculationDiv)
  mainPanel.appendChild(selectionDiv)
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
  const newDataFilterElements: string[] = [
    "#fightRange",
    "#runway",
    "#min_capacity",
    "#min_circulation",
    "#use_flight_total"
  ]

  const elementRefs = newDataFilterElements.map((id) => document.querySelector(id))

  elementRefs.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.addEventListener("change", () => window.updateAirplaneModelTable(element.id, "descending"))
    }
  })
}
