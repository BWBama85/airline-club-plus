import { fetchData } from "~/apiService"
import { plotPie } from "~helpers/plotPie"

export async function loadCompetitionForLink(airlineId: number, link: any): Promise<any> {
  const linkConsumptions = await fetchData(`airports/${link.fromAirportId}/to/${link.toAirportId}`)
  const linkCompetitions = document.getElementById("linkCompetitons")

  // Remove existing data rows
  const existingRows = linkCompetitions.querySelectorAll(".data-row")
  existingRows.forEach((row) => row.remove())

  // Create and append new rows
  linkConsumptions.forEach((linkConsumption: any) => {
    let row = document.createElement("div")
    row.className = "table-row data-row"
    row.innerHTML = `
        <div style='display: table-cell;'>${linkConsumption.airlineName}</div>
        <div style='display: table-cell;'>${window.toLinkClassValueString(linkConsumption.price, "$")}</div>
        <div style='display: table-cell; text-align: right;'>${window.toLinkClassValueString(
          linkConsumption.capacity
        )}</div>
        <div style='display: table-cell; text-align: right;'>${linkConsumption.quality}</div>
        <div style='display: table-cell; text-align: right;'>${linkConsumption.frequency}</div>
      `

    if (linkConsumption.airlineId == airlineId) {
      // Self is always on top
      const tableHeader = linkCompetitions.querySelector(".table-header")
      linkCompetitions.insertBefore(row, tableHeader.nextSibling)
    } else {
      linkCompetitions.appendChild(row)
    }
  })

  if (!linkCompetitions.querySelector(".data-row")) {
    let row = document.createElement("div")
    row.className = "table-row data-row"
    row.innerHTML = `<div style='display: table-cell;'>-</div><div style='display: table-cell;'>-</div><div style='display: table-cell;'>-</div><div style='display: table-cell;'>-</div><div style='display: table-cell;'>-</div>`
    linkCompetitions.appendChild(row)
  }

  linkCompetitions.style.display = "block"

  window.assignAirlineColors(linkConsumptions, "airlineId")
  plotPie(linkConsumptions, null, document.getElementById("linkCompetitionsPie"), "airlineName", "soldSeats")

  return linkConsumptions
}
