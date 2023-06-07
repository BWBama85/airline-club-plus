import type { PlasmoCSConfig } from "plasmo"

import { loadLinksTable } from "~/modules/loadLinksTable"
import { toggleLinksTableSortOrder } from "~helpers/utils"

export const config: PlasmoCSConfig = {
  world: "MAIN",
  matches: ["https://*.airline-club.com/*"],
  run_at: "document_start"
}

window.addEventListener("DOMContentLoaded", async () => {
  window.toggleLinksTableSortOrder = toggleLinksTableSortOrder
  window.loadLinksTable = loadLinksTable
})

window.addEventListener("load", async () => {
  const $ = window.$
  $.cookie = window.$.cookie
})
