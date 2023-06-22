import type { PlasmoCSConfig } from "plasmo"

import { addInputCells, addTableHeaderCells, setupNewDataFilterElements } from "~/helpers/airplane"
import { MAX_FLIGHT_MINUTES, airplaneTypeMap } from "~/helpers/constants"
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

    for (let plane of Object.values(window.loadedModelsOwnerInfo)) {
      // console.dir(JSON.parse(JSON.stringify(plane)))
      if (plane.range < distance || plane.runwayRequirement > runway) {
        plane.cpp = -1
        plane.max_rotation = -1
        continue
      }
      let plane_category = airplaneTypeMap[plane.airplaneType.toUpperCase()]

      // Call to the calcFlightTime function
      let flightDuration = calcFlightTime(plane, distance)
      let price = plane.price
      if (plane.originalPrice) {
        price = plane.originalPrice
      }

      const frequency = Math.floor(MAX_FLIGHT_MINUTES / ((flightDuration + plane.turnaroundTime) * 2))

      const flightTime = frequency * 2 * (flightDuration + plane.turnaroundTime)
      const availableFlightMinutes = MAX_FLIGHT_MINUTES - flightTime
      const utilisation = flightTime / (MAX_FLIGHT_MINUTES - availableFlightMinutes)
      const planeUtilisation = (MAX_FLIGHT_MINUTES - availableFlightMinutes) / MAX_FLIGHT_MINUTES

      const decayRate = (100 / (plane.lifespan * 3)) * (1 + 2 * planeUtilisation)
      const depreciationRate = Math.floor(price * (decayRate / 100) * utilisation)
      const maintenance = plane.capacity * 100 * utilisation

      const airport_fee = (500 * plane_category + plane.capacity * 10) * 2
      const crew_cost = plane.capacity * (flightDuration / 60) * 12
      const inflight_cost = (20 + (8 * flightDuration) / 60) * plane.capacity * 2

      plane.max_rotation = frequency

      // Call to the calcFuelBurn function
      plane.fbpf = calcFuelBurn(plane, distance)
      plane.fbpp = plane.fbpf / plane.capacity
      plane.fbpw = plane.fbpf * plane.max_rotation
      plane.fuel_total =
        (plane.fbpf * 0.08 + airport_fee + inflight_cost + crew_cost) * plane.max_rotation +
        depreciationRate +
        maintenance
      plane.cpp = plane.fuel_total / (plane.capacity * plane.max_rotation)
      plane.max_capacity = plane.capacity * plane.max_rotation
      if (!plane.in_use) {
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

    Array.from(airplaneModelTable.children).forEach((child) => {
      if (child.classList.contains("table-row")) {
        airplaneModelTable.removeChild(child)
      }
    })

    for (let modelOwnerInfo of Object.values(window.loadedModelsOwnerInfo)) {
      if (!modelOwnerInfo.in_use) {
        modelOwnerInfo.in_use = 0
      }
      console.dir(modelOwnerInfo)
      const isOwned =
        modelOwnerInfo.assignedAirplanes.length +
          modelOwnerInfo.availableAirplanes.length +
          modelOwnerInfo.constructingAirplanes.length !==
        0
      if (
        modelOwnerInfo.cpp === -1 ||
        modelOwnerInfo.max_capacity < min_capacity ||
        modelOwnerInfo.in_use < min_circulation
      ) {
        continue
      }
      const row = createRowElement(modelOwnerInfo, isOwned)
      const cells = createCellContents(modelOwnerInfo)

      cells.forEach((content) => {
        const cell = document.createElement("div")
        cell.className = "cell"
        cell.innerHTML = content
        row.appendChild(cell)
      })

      airplaneModelTable.appendChild(row)
    }
  }

  window.loadAirplaneModelStats = loadAirplaneModelStats
})
