import { fetchData } from "~/apiService"
import { loadCompetitionForLink } from "~/modules/loadCompetitionForLink"
import { loadHistoryForLink } from "~/modules/loadHistoryForLink"
import type { Link } from "~/types/types"

export async function loadLink(
  airlineId: number,
  linkId: number
): Promise<{ link: Link; linkCompetition: any; linkHistory: any }> {
  const link: Link = await fetchData(`airlines/${airlineId}/links/${linkId}`)

  window.document.getElementById("linkFromAirport").setAttribute("onclick", `showAirportDetails(${link.fromAirportId})`)
  window.document.getElementById("linkFromAirport").innerHTML =
    window.getCountryFlagImg(link.fromCountryCode) + window.getAirportText(link.fromAirportCity, link.fromAirportCode)

  window.document.getElementById("linkToAirport").setAttribute("onclick", `showAirportDetails(${link.toAirportId})`)
  window.document.getElementById("linkToAirport").innerHTML =
    window.getCountryFlagImg(link.toCountryCode) + window.getAirportText(link.toAirportCity, link.toAirportCode)

  window.document.getElementById("linkFlightCode").textContent = link.flightCode

  const airplaneModel =
    link.assignedAirplanes && link.assignedAirplanes.length > 0
      ? `${link.assignedAirplanes[0].airplane.name} (${link.assignedAirplanes.length})`
      : "-"
  window.document.getElementById("linkAirplaneModel").textContent = airplaneModel

  window.document.getElementById("linkCurrentPrice").textContent = window.toLinkClassValueString(link.price, "$")
  window.document.getElementById("linkDistance").textContent = `${link.distance} km (${link.flightType})`
  window.document.getElementById("linkQuality").innerHTML =
    window.getGradeStarsImgs(Math.round(link.computedQuality / 10)).join("") + link.computedQuality
  window.document.getElementById("linkCurrentCapacity").textContent = window.toLinkClassValueString(link.capacity)

  if (link.future) {
    ;(
      window.document.getElementById("linkCurrentDetails").querySelector(".future .capacity") as HTMLElement
    ).textContent = window.toLinkClassValueString(link.future.capacity)
    ;(window.document.getElementById("linkCurrentDetails").querySelector(".future") as HTMLElement).style.display =
      "block"
  } else {
    ;(window.document.getElementById("linkCurrentDetails").querySelector(".future") as HTMLElement).style.display =
      "none"
  }
  window.document.getElementById("linkCurrentDetails").style.display = "block"
  ;(window.document.getElementById("linkToAirportId") as HTMLInputElement).value = link.toAirportId.toString()
  ;(window.document.getElementById("linkFromAirportId") as HTMLInputElement).value = link.fromAirportId.toString()

  const plotUnit = (window.document.getElementById("linkDetails").querySelector("#switchMonth") as HTMLInputElement)
    .checked
    ? window.plotUnitEnum.MONTH
    : window.plotUnitEnum.QUARTER

  const cycleCount = plotUnit.maxWeek

  const [linkCompetition, linkHistory] = await Promise.all([
    loadCompetitionForLink(airlineId, link),
    loadHistoryForLink(airlineId, linkId, cycleCount, link)
  ])

  return {
    link,
    linkCompetition,
    linkHistory
  }
}
