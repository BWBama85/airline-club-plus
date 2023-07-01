// Import the PlasmoCSConfig type from the plasmo package
import type { PlasmoCSConfig } from "plasmo"

// Import the loadAirplaneModelStats and updateAirplaneModelTable functions from local modules
import { loadAirplaneModelStats } from "~/modules/loadAirplaneModelStats"
import { updateAirplaneModelTable } from "~/modules/updateAirplaneModelTable"

// Define the configuration for the Plasmo Content Script (PlasmoCS)
export const config: PlasmoCSConfig = {
  // Specify the world for the PlasmoCS to operate within
  world: "MAIN",
  // Provide the URLs that the PlasmoCS should match and execute on
  matches: ["https://*.airline-club.com/*"],
  // Define when the PlasmoCS script should run within the webpage lifecycle
  run_at: "document_start"
}

// Define a function to add an input cell to the main panel of the webpage
function addInputCell(id: string, labelText: string, mainPanel: HTMLElement, value: string = "0"): void {
  // Create a new div and add the required classes and HTML
  const div = document.createElement("div")
  div.classList.add("cell", "detailsSelection")
  div.innerHTML = `${labelText}: <input type="text" id="${id}" value="${value}" />`
  // Append the new div to the main panel
  mainPanel.appendChild(div)
}

// Define a function to add a cell to the table header of the airplane model table
function addCellToHeader(sortProperty: string, content: string, airplaneModelSortHeader: HTMLElement): void {
  // Create a new div and add the required classes, attributes, styles, and content
  const div = document.createElement("div")
  div.classList.add("cell", "clickable")
  div.setAttribute("data-sort-property", sortProperty)
  div.setAttribute("data-sort-order", "ascending")
  div.style.textAlign = "right"
  div.textContent = content
  div.setAttribute("onclick", "toggleAirplaneModelTableSortOrder($(this))")
  // Append the new div to the airplane model table header
  airplaneModelSortHeader.appendChild(div)
}

// Add an event listener for the DOMContentLoaded event
// This event fires when the initial HTML document has been completely loaded and parsed
window.addEventListener("DOMContentLoaded", async () => {
  // Fetch the hangar div and the main panel element
  const hangarDiv = document.querySelector('div[data-type="hangar"]')
  const mainPanel: HTMLElement = document.querySelector(
    "#airplaneCanvas .mainPanel .section .table .table-header:first-child"
  )

  // If the hangar div is not selected and the main panel exists, prepare the page for input and display of data
  if (hangarDiv && !hangarDiv.classList.contains("selected") && mainPanel) {
    // Remove any style attributes from the hangar div
    hangarDiv.removeAttribute("style")

    // Add input cells for various filter criteria to the main panel
    addInputCell("fightRange", "Distance", mainPanel, "1000")
    addInputCell("runway", "Runway length", mainPanel, "3600")
    addInputCell("min_capacity", "Min. Capacity", mainPanel)
    addInputCell("min_circulation", "Min. Circulation", mainPanel)

    // Create a new div for additional filter criteria, add the required classes and styles, and append it to the main panel -- Additional adjustments for the selectionDiv
    const selectionDiv = document.createElement("div")
    selectionDiv.classList.add("cell", "detailsSelection")
    selectionDiv.style.minWidth = "160px"
    selectionDiv.style.textAlign = "right"
    selectionDiv.innerHTML = `<label for="fuel_total">Flight Fuel Total <input type="checkbox" id="fuel_total" /></label>`
    mainPanel.appendChild(selectionDiv)
  }

  // Define the width percentages for the cells in the airplane model table header
  const columnWidthPercents: number[] = [17, 12, 9, 7, 7, 7, 7, 9, 7, 6, 3, 5]
  const airplaneModelSortHeader: HTMLElement = document.getElementById("airplaneModelSortHeader")

  // If the airplane model table header exists, add cells for additional sort properties
  if (airplaneModelSortHeader) {
    addCellToHeader("max_rotation", "⏲", airplaneModelSortHeader)
    addCellToHeader("cpp", "$/🧍", airplaneModelSortHeader)
    addCellToHeader("in_use", "#✈", airplaneModelSortHeader)
  }

  // Fetch the cells in the airplane model table header and set their width percentages
  const headerCells = document.querySelectorAll("#airplaneModelSortHeader .cell")
  headerCells.forEach((headerCell, index) => {
    headerCell.setAttribute("style", `width: ${columnWidthPercents[index]}%`)
  })

  // Fetch the airplane model table and add empty cells with specific width percentages
  const airplaneModelTable = document.querySelector("#airplaneModelTable .table-header")
  if (airplaneModelTable) {
    let html = ""
    columnWidthPercents.forEach((width) => {
      html += `<div class="cell" style="width: ${width}%; border-bottom: none;"></div>`
    })
    airplaneModelTable.innerHTML = html
  }

  // Fetch the elements with the 'totalOwned' sort property and adjust their text content and width
  const totalOwnedElems = document.querySelectorAll('[data-sort-property="totalOwned"]')
  totalOwnedElems.forEach((elem) => {
    elem.textContent = "Owned"
    elem.setAttribute("style", "width: 6%;")
  })

  // Define an array of filter criteria input ids
  const newDataFilterElements: string[] = ["#fightRange", "#runway", "#min_capacity", "#min_circulation", "#fuel_total"]
  // Add change event listeners to the filter criteria inputs to trigger a table update when they are changed
  newDataFilterElements.forEach((id) => {
    const element = document.querySelector(id)
    if (element instanceof HTMLElement) {
      element.addEventListener("change", () => window.updateAirplaneModelTable(element.id, "descending"))
    }
  })

  // Attach the updateAirplaneModelTable and loadAirplaneModelStats functions to the global window object
  window.updateAirplaneModelTable = updateAirplaneModelTable
  
  window.loadAirplaneModelStats = loadAirplaneModelStats
})
