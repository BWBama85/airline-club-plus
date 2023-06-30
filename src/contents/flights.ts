// Import the PlasmoCSConfig type from the plasmo package
import type { PlasmoCSConfig } from "plasmo"

// Import the loadLinksTable and updateLinksTable functions from modules
import { loadLinksTable } from "~/modules/loadLinksTable"
import { updateLinksTable } from "~/modules/updateLinksTable"

// Define the configuration for the Plasmo Content Script (PlasmoCS)
export const config: PlasmoCSConfig = {
  // Specify the world for the PlasmoCS to operate within
  world: "MAIN",
  // Provide the URLs that the PlasmoCS should match and execute on
  matches: ["https://*.airline-club.com/*"],
  // Define when the PlasmoCS script should run within the webpage lifecycle
  run_at: "document_start"
}

// Add an event listener for the DOMContentLoaded event
// This event fires when the initial HTML document has been completely loaded and parsed
window.addEventListener("DOMContentLoaded", async () => {
  // Define a global function to handle the toggling of sort order on the links table
  window.toggleLinksTableSortOrder = function toggleLinksTableSortOrder(sortHeader: HTMLElement): void {
    // Fetch the current sort order from the sortHeader's data-sort-order attribute
    const sortOrder = sortHeader.getAttribute("data-sort-order")

    // If the current sort order is 'ascending', switch it to 'descending', and vice versa
    if (sortOrder === "ascending") {
      sortHeader.setAttribute("data-sort-order", "descending")
    } else {
      sortHeader.setAttribute("data-sort-order", "ascending")
    }

    // Remove the 'selected' class from all siblings of the sortHeader
    // Add the 'selected' class to the sortHeader
    Array.from(sortHeader.parentElement?.children ?? []).forEach((sibling) => {
      if (sibling !== sortHeader) {
        sibling.classList.remove("selected")
      }
    })
    
    sortHeader.classList.add("selected")

    // Fetch the updated sort property and sort order from the sortHeader's data attributes
    const sortProperty = sortHeader.getAttribute("data-sort-property")
    const updatedSortOrder = sortHeader.getAttribute("data-sort-order")

    // If both the sort property and sort order are defined, update the links table accordingly
    if (sortProperty && updatedSortOrder) {
      updateLinksTable(sortProperty, updatedSortOrder)
    }
  }
  // Attach the loadLinksTable function to the global window object
  window.loadLinksTable = loadLinksTable
})

// Add an event listener for the load event
// This event fires when the entire webpage has finished loading, including all resources like images and stylesheets
window.addEventListener("load", async () => {
  // Define a global $ variable, which is often used for libraries like jQuery
  // Copy the $.cookie function from the global window object to the $ object
  const $ = window.$
  $.cookie = window.$.cookie
})
