import type { PlasmoCSConfig } from "plasmo"

import { loadAirplaneModelStats } from "~/modules/loadAirplaneModelStats"
import { updateAirplaneModelTable } from "~/modules/updateAirplaneModelTable"

export const config: PlasmoCSConfig = {
  world: "MAIN",
  matches: ["https://*.airline-club.com/*"],
  run_at: "document_start"
}

function addInputCell(id: string, labelText: string, mainPanel: HTMLElement, value: string = "0"): void {
  const div = document.createElement("div")
  div.classList.add("cell", "detailsSelection")
  div.innerHTML = `${labelText}: <input type="text" id="${id}" value="${value}" />`
  mainPanel.appendChild(div)
}

function addCellToHeader(sortProperty: string, content: string, airplaneModelSortHeader: HTMLElement): void {
  const div = document.createElement("div")
  div.classList.add("cell", "clickable")
  div.setAttribute("data-sort-property", sortProperty)
  div.setAttribute("data-sort-order", "ascending")
  div.style.textAlign = "right"
  div.textContent = content
  div.setAttribute("onclick", "toggleAirplaneModelTableSortOrder($(this))")
  airplaneModelSortHeader.appendChild(div)
}

window.addEventListener("DOMContentLoaded", async () => {
  const hangarDiv = document.querySelector('div[data-type="hangar"]')
  const mainPanel: HTMLElement = document.querySelector(
    "#airplaneCanvas .mainPanel .section .table .table-header:first-child"
  )

  if (hangarDiv && !hangarDiv.classList.contains("selected") && mainPanel) {
    // Remove the style attribute
    hangarDiv.removeAttribute("style")

    addInputCell("fightRange", "Distance", mainPanel, "1000")
    addInputCell("runway", "Runway length", mainPanel, "3600")
    addInputCell("min_capacity", "Min. Capacity", mainPanel)
    addInputCell("min_circulation", "Min. Circulation", mainPanel)

    // Additional adjustments for the selectionDiv
    const selectionDiv = document.createElement("div")
    selectionDiv.classList.add("cell", "detailsSelection")
    selectionDiv.style.minWidth = "160px"
    selectionDiv.style.textAlign = "right"
    selectionDiv.innerHTML = `<label for="fuel_total">Flight Fuel Total <input type="checkbox" id="fuel_total" /></label>`
    mainPanel.appendChild(selectionDiv)
  }

  const columnWidthPercents: number[] = [17, 12, 9, 7, 7, 7, 7, 9, 7, 6, 3, 5]
  const airplaneModelSortHeader: HTMLElement = document.getElementById("airplaneModelSortHeader")

  if (airplaneModelSortHeader) {
    addCellToHeader("max_rotation", "⏲", airplaneModelSortHeader)
    addCellToHeader("cpp", "$/🧍", airplaneModelSortHeader)
    addCellToHeader("in_use", "#✈", airplaneModelSortHeader)
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

  const newDataFilterElements: string[] = ["#fightRange", "#runway", "#min_capacity", "#min_circulation", "#fuel_total"]
  newDataFilterElements.forEach((id) => {
    const element = document.querySelector(id)
    if (element instanceof HTMLElement) {
      element.addEventListener("change", () => window.updateAirplaneModelTable(element.id, "descending"))
    }
  })

  window.updateAirplaneModelTable = updateAirplaneModelTable

  window.loadAirplaneModelStats = loadAirplaneModelStats
})
