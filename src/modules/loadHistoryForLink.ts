import { fetchData } from "~/apiService"
import { averageFromSubKey } from "~/helpers/utils"

export async function loadHistoryForLink(
  airlineId: number,
  linkId: number,
  cycleCount: number,
  link: Link
): Promise<Link | void> {
  const linkHistory = await fetchData(`airlines/${airlineId}/link-consumptions/${linkId}?cycleCount=${cycleCount}`)

  if (Object.keys(linkHistory).length === 0) {
    window.document.getElementById("linkHistoryPrice")!.textContent = "-"
    window.document.getElementById("linkHistoryCapacity")!.textContent = "-"
    window.document.getElementById("linkLoadFactor")!.textContent = "-"
    window.document.getElementById("linkProfit")!.textContent = "-"
    window.document.getElementById("linkRevenue")!.textContent = "-"
    window.document.getElementById("linkFuelCost")!.textContent = "-"
    window.document.getElementById("linkCrewCost")!.textContent = "-"
    window.document.getElementById("linkAirportFees")!.textContent = "-"
    window.document.getElementById("linkDepreciation")!.textContent = "-"
    window.document.getElementById("linkCompensation")!.textContent = "-"
    window.document.getElementById("linkLoungeCost")!.textContent = "-"
    window.document.getElementById("linkServiceSupplies")!.textContent = "-"
    window.document.getElementById("linkMaintenance")!.textContent = "-"
    window.document.getElementById("linkOtherCosts")!.textContent = "-"
    window.document.getElementById("linkDelays")!.textContent = "-"
    window.document.getElementById("linkCancellations")!.textContent = "-"

    window.disableButton(
      window.document.querySelector("#linkDetails .button.viewLinkHistory") as HTMLButtonElement,
      "Passenger Map is not yet available for this route - please wait for the simulation (time estimation on top left of the screen)."
    )
    window.disableButton(
      window.document.querySelector("#linkDetails .button.viewLinkComposition") as HTMLButtonElement,
      "Passenger Survey is not yet available for this route - please wait for the simulation (time estimation on top left of the screen)."
    )

    window.plotHistory(linkHistory)
    return
  }

  if (!window.document.getElementById("linkAverageLoadFactor")) {
    const loadFactorDiv = window.document.createElement("div")
    loadFactorDiv.className = "table-row"
    loadFactorDiv.style.color = "#999"
    loadFactorDiv.innerHTML = `
      <div class="label" style="color:#999"><h5>Avg. Load Factor:</h5></div>
      <div class="value" id="linkAverageLoadFactor"></div>
    `
    window.document.getElementById("linkLoadFactor")!.parentElement!.insertAdjacentElement("afterend", loadFactorDiv)
  }

  if (!window.document.getElementById("linkAverageProfit")) {
    const profitDiv = window.document.createElement("div")
    profitDiv.className = "table-row"
    profitDiv.style.color = "#999"
    profitDiv.innerHTML = `
      <div class="label" style="color:#999"><h5>Avg. Profit:</h5></div>
      <div class="value" id="linkAverageProfit"></div>
    `
    window.document.getElementById("linkProfit")!.parentElement!.insertAdjacentElement("afterend", profitDiv)
  }

  const averageLoadFactor = window.getLoadFactorsFor({
    soldSeats: {
      economy: averageFromSubKey(linkHistory, "soldSeats", "economy"),
      business: averageFromSubKey(linkHistory, "soldSeats", "business"),
      first: averageFromSubKey(linkHistory, "soldSeats", "first")
    },
    capacity: {
      economy: averageFromSubKey(linkHistory, "capacity", "economy"),
      business: averageFromSubKey(linkHistory, "capacity", "business"),
      first: averageFromSubKey(linkHistory, "capacity", "first")
    }
  })

  const latestLinkData = linkHistory[0]
  window.document.getElementById("linkHistoryPrice")!.textContent = window.toLinkClassValueString(
    latestLinkData.price,
    "$"
  )
  window.document.getElementById("linkHistoryCapacity")!.textContent = window.toLinkClassValueString(
    latestLinkData.capacity
  )
  window.document.getElementById("linkLoadFactor")!.textContent = window.toLinkClassValueString(
    window.getLoadFactorsFor(latestLinkData),
    "",
    "%"
  )
  window.document.getElementById("linkAverageLoadFactor")!.textContent = window.toLinkClassValueString(
    averageLoadFactor,
    "",
    "%"
  )

  const dollarValuesByElementId = {
    linkProfit: latestLinkData.profit,
    linkAverageProfit: Math.round(averageFromSubKey(linkHistory, "profit")),
    linkRevenue: latestLinkData.revenue,
    linkFuelCost: latestLinkData.fuelCost,
    linkCrewCost: latestLinkData.crewCost,
    linkAirportFees: latestLinkData.airportFees,
    linkDepreciation: latestLinkData.depreciation,
    linkCompensation: latestLinkData.delayCompensation,
    linkLoungeCost: latestLinkData.loungeCost,
    linkServiceSupplies: latestLinkData.inflightCost,
    linkMaintenance: latestLinkData.maintenanceCost
  }

  for (const elementId in dollarValuesByElementId) {
    window.document.getElementById(elementId)!.textContent =
      "$" + new Intl.NumberFormat("en-US").format(dollarValuesByElementId[elementId])
  }

  if (latestLinkData.minorDelayCount == 0 && latestLinkData.majorDelayCount == 0) {
    const linkDelaysElement = window.document.getElementById("linkDelays")!
    linkDelaysElement.classList.remove("warning")
    linkDelaysElement.textContent = "-"
  } else {
    const linkDelaysElement = window.document.getElementById("linkDelays")!
    linkDelaysElement.classList.add("warning")
    linkDelaysElement.textContent = `${latestLinkData.minorDelayCount} minor ${latestLinkData.majorDelayCount} major`
  }

  if (latestLinkData.cancellationCount == 0) {
    const linkCancellationsElement = window.document.getElementById("linkCancellations")!
    linkCancellationsElement.classList.remove("warning")
    linkCancellationsElement.textContent = "-"
  } else {
    const linkCancellationsElement = window.document.getElementById("linkCancellations")!
    linkCancellationsElement.classList.add("warning")
    linkCancellationsElement.textContent = `${latestLinkData.cancellationCount}`
  }

  window.enableButton(window.document.querySelector("#linkDetails .button.viewLinkHistory") as HTMLButtonElement)
  window.enableButton(window.document.querySelector("#linkDetails .button.viewLinkComposition") as HTMLButtonElement)

  window.plotHistory(linkHistory)

  return linkHistory
}
