import type { PlasmoCSConfig } from "plasmo"

import { loadLinksTable } from "~/modules/loadLinksTable"
import { updateLinksTable } from "~/modules/updateLinksTable"

export const config: PlasmoCSConfig = {
  world: "MAIN",
  matches: ["https://*.airline-club.com/*"],
  run_at: "document_start"
}

window.addEventListener("DOMContentLoaded", async () => {
  window.toggleLinksTableSortOrder = function toggleLinksTableSortOrder(sortHeader: HTMLElement): void {
    const sortOrder = sortHeader.getAttribute("data-sort-order")

    if (sortOrder === "ascending") {
      sortHeader.setAttribute("data-sort-order", "descending")
    } else {
      sortHeader.setAttribute("data-sort-order", "ascending")
    }

    Array.from(sortHeader.parentElement?.children ?? []).forEach((sibling) => {
      if (sibling !== sortHeader) {
        sibling.classList.remove("selected")
      }
    })

    sortHeader.classList.add("selected")

    const sortProperty = sortHeader.getAttribute("data-sort-property")
    const updatedSortOrder = sortHeader.getAttribute("data-sort-order")

    if (sortProperty && updatedSortOrder) {
      updateLinksTable(sortProperty, updatedSortOrder)
    }
  }
  window.loadLinksTable = loadLinksTable
})

window.addEventListener("load", async () => {
  const $ = window.$
  $.cookie = window.$.cookie
})
