import { fetchData } from "~/apiService"
import { populateDerivedFieldsOnLink } from "~/helpers/utils"
import { updateCustomLinkTableHeader } from "~/modules/updateCustomLinkTableHeader"
import { updateLinksTable } from "~/modules/updateLinksTable"
import type { Link } from "~/types/types"

export async function loadLinksTable(): Promise<void> {
  try {
    if (!window.activeAirline) throw new Error("Active airline not set")

    const links: Link[] = await fetchData(`airlines/${window.activeAirline.id}/links-details`)

    updateCustomLinkTableHeader()
    window.updateLoadedLinks(links)

    links.forEach((link, key) => populateDerivedFieldsOnLink(link))

    const linksTableSortHeader = window.document.getElementById("linksTableSortHeader")
    if (!linksTableSortHeader) throw new Error("linksTableSortHeader element not found")

    const selectedSortHeader = Array.from(linksTableSortHeader.getElementsByClassName("cell")).find((element) =>
      element.classList.contains("selected")
    )

    if (selectedSortHeader) {
      const sortProperty = selectedSortHeader.getAttribute("data-sort-property")
      const sortOrder = selectedSortHeader.getAttribute("data-sort-order")

      updateLinksTable(sortProperty, sortOrder)
    }
  } catch (error) {
    console.error(error)
  }
}
