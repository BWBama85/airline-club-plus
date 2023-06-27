import type { PlasmoCSConfig } from "plasmo"

import {
  addInputCells,
  addTableHeaderCells,
  calculateCosts,
  calculateUtilisation,
  isModelOwned,
  isValidModel,
  populateTableCells,
  setupNewDataFilterElements
} from "~/helpers/airplane"
import { createCellContents, createRowElement } from "~/helpers/tables"
import { calcFlightTime, calcFuelBurn, sortByProperty } from "~/helpers/utils"
import { loadAirplaneModelStats } from "~/modules/loadAirplaneModelStats"

export const config: PlasmoCSConfig = {
  world: "MAIN",
  matches: ["https://*.airline-club.com/*"],
  run_at: "document_start"
}

window.addEventListener("DOMContentLoaded", async () => {
  addInputCells()

  addTableHeaderCells()

  setupNewDataFilterElements()

  window.updateAirplaneModelTable = async function (sortProperty: string, sortOrder: string): Promise<void> {
    const distance = Number((document.getElementById("fightRange") as HTMLInputElement).value)
    const runway = Number((document.getElementById("runway") as HTMLInputElement).value)
    const min_capacity = Number((document.getElementById("min_capacity") as HTMLInputElement).value)
    const min_circulation = Number((document.getElementById("min_circulation") as HTMLInputElement).value)
    const use_flight_total = (document.getElementById("use_flight_total") as HTMLInputElement).checked
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
      const { depreciationRate, maintenance, airport_fee, crew_cost, inflight_cost } = calculateCosts(
        plane,
        flightDuration,
        plane_category,
        utilisation
      )

      plane.max_rotation = frequency
      plane.fbpf = calcFuelBurn(plane, distance)
      plane.fbpp = plane.fbpf / plane.capacity
      plane.fbpw = plane.fbpf * plane.max_rotation
      plane.fuel_total =
        (plane.fbpf * 0.08 + airport_fee + inflight_cost + crew_cost) * plane.max_rotation +
        depreciationRate +
        maintenance
      plane.cpp = plane.fuel_total / (plane.capacity * plane.max_rotation)
      plane.max_capacity = plane.capacity * plane.max_rotation

      if (plane.in_use === undefined) {
        plane.in_use = -1
        await window.loadAirplaneModelStats(plane, { totalOnly: true })
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

    //sort the list
    window.loadedModelsOwnerInfo.sort(sortByProperty(sortProperty, sortOrder == "ascending"))

    var childElements = airplaneModelTable.querySelectorAll("div.table-row")

    childElements.forEach(function (child) {
      airplaneModelTable.removeChild(child)
    })

    for (let modelOwnerInfo of Object.values(window.loadedModelsOwnerInfo)) {
      modelOwnerInfo.in_use = modelOwnerInfo.in_use || 0

      const isOwned = isModelOwned(modelOwnerInfo)

      if (!isValidModel(modelOwnerInfo, min_capacity, min_circulation)) {
        continue
      }

      const row = createRowElement(modelOwnerInfo, isOwned)
      const cells = createCellContents(modelOwnerInfo)

      populateTableCells(row, cells)

      airplaneModelTable.appendChild(row)
    }
  }

  window.loadAirplaneModelStats = loadAirplaneModelStats
})
