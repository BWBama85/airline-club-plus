import { fadeIn, hideActiveDiv, setActiveDiv } from "~/helpers/utils"
import { loadLink } from "~/modules/loadLink"

export async function refreshLinkDetails(linkId: number): Promise<void> {
  const airlineId = window.activeAirline?.id

  const linkCompetitions = window.document.querySelectorAll("#linkCompetitons .data-row")
  linkCompetitions.forEach((row) => row.remove())

  const actionLinkIdInput = window.document.getElementById("actionLinkId") as HTMLInputElement | null
  if (actionLinkIdInput) {
    actionLinkIdInput.value = String(linkId)
  }

  const linkDetailsPromise = loadLink(airlineId, linkId)

  const linkDetailsPanel = window.document.getElementById("linkDetails")
  if (linkDetailsPanel) {
    setActiveDiv(linkDetailsPanel)
  }

  const airplaneModelDetailsPanel = window.document
    .getElementById("extendedPanel")
    ?.querySelector("#airplaneModelDetails")
  if (airplaneModelDetailsPanel) {
    hideActiveDiv(airplaneModelDetailsPanel)
  }

  const sidePanel = window.document.getElementById("sidePanel")
  if (sidePanel) {
    sidePanel.style.display = "block"
    sidePanel.style.opacity = "0"
    fadeIn(sidePanel, 500)
  }

  const { link, linkCompetition, linkHistory } = await linkDetailsPromise
}
