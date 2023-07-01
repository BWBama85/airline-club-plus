import { formatCurrency, getStyleFromTier, getTierFromPercent } from "~/helpers/utils"

// Function to append a cell to a row
function appendCell(
  row: HTMLDivElement,
  title: string,
  content: string,
  style?: string,
  isEllipsis: boolean = false, // Whether to truncate text that overflows
  align: "left" | "right" = "left" // Text alignment
): void {
  const cell = createCell(title, content, align, isEllipsis, style) // Create the cell
  row.appendChild(cell) // Append the cell to the row
}

// Function to create a cell
function createCell(
  title: string,
  content: string,
  align = "left",
  isEllipsis = false,
  style?: string
): HTMLDivElement {
  const cell = document.createElement("div") // Create a div element
  cell.className = "cell" // Add class, align text, set title and content
  cell.style.textAlign = align
  cell.title = title
  cell.textContent = content
  // Apply additional style if provided
  if (style) {
    cell.style.cssText = style
  }
  // Apply text truncation settings if required
  if (isEllipsis) {
    cell.style.textOverflow = "ellipsis"
    cell.style.overflow = "hidden"
    cell.style.whiteSpace = "pre"
  }
  return cell
}

// Function to create a clickable row for a link
function createLinkRow(colorKeyMaps: Record<string, WeakMap<Link, any>>, link: Link) {
  // Create a div element and add the class
  const row = window.document.createElement("div")
  row.className = "table-row clickable"
  
  // Set the row to be selectable
  row.onclick = () => selectLinkFromTable(row, link.id)

  // Populate cells in the row
  populateLinkRowCells(colorKeyMaps, row, link)

  return row
}

// Function to generate load factor breakdown text
function generateLfBreakdownText(link: Link, lfBreakdown: Record<string, number>): string {
  if (link.totalLoadFactor === 100) {
    return "100"
  }

  // Generate the breakdown text
  return Object.values(lfBreakdown)
    .map((v) => (v ? Math.floor(100 * v) : "-"))
    .join("/")
}

// Function to get style for a particular link key
function getKeyedStyleFromLink(
  colorKeyMaps: Record<string, WeakMap<Link, any>>,
  link: Link,
  keyName: string,
  ...args: number[]
): { color: string; fontWeight?: string } {
  let colorKeyMap = colorKeyMaps[keyName]

  // Check if the key map for this keyName exists, if not create a new WeakMap for it
  // -- Update the colorKeyMap reference along with the colorKeyMaps record
  if (!colorKeyMaps[keyName]) {
    colorKeyMap = colorKeyMaps[keyName] = new WeakMap<Link, any>()
  } else if (colorKeyMap.has(link)) {
    // If the key map already has a style for this link, return it -- Use the local reference
    return colorKeyMap.get(link)
  }

  const data = window.loadedLinks.map((l) => l[keyName]) // Get the array of keyName data from all links

  // Calculate the average of this data
  const avg = data.reduce((sum, acc) => (sum += acc), 0) / window.loadedLinks.length
  // Find the maximum value in this data, with a lower limit of 0
  const min = Math.max(0, ...data)
  // Get the tier from the percent
  const tier = getTierFromPercent(link[keyName], args[0] ?? min, args[1] ?? avg * 0.618)

  // Store the tier in the link's tiers object
  link.tiers = link.tiers || {}
  link.tiers[keyName] = tier

  const colorResult = getStyleFromTier(tier) // Get the color for this tier
  colorKeyMap.set(link, colorResult) // Store the color in the colorKeyMap

  return colorResult
}

// Function to abbreviate an airplane model name
function abbreviateModelName(airplaneName: string): string {
  // Split the airplane name into sections
  const sections = airplaneName.trim().split(" ").slice(1)

  // Map through each section, and return an abbreviation if possible
  return sections
    .map((str) =>
      str.includes("-") || str.length < 4 || /^[A-Z0-9\-]+[a-z]{0,4}$/.test(str) ? str : str[0].toUpperCase()
    )
    .join(" ")
}

// This function populates a row for a given link with relevant data cells
function populateLinkRowCells(colorKeyMaps: Record<string, WeakMap<Link, any>>, row: HTMLDivElement, link: Link): void {
  // Extract full airport names for source and destination
  const srcAirportFull = window.getAirportText(link.fromAirportCity, link.fromAirportCode)
  const destAirportFull = window.getAirportText(link.toAirportCity, link.toAirportCode)

  // Compute load factor breakdown (passengers/capacity) for economy, business and first class
  const { economy, business, first } = link.passengers
  const { economy: capacityEconomy, business: capacityBusiness, first: capacityFirst } = link.capacity
  const lfBreakdown = {
    economy: economy / capacityEconomy,
    business: business / capacityBusiness,
    first: first / capacityFirst
  }

  // Generate load factor breakdown text for displaying on the UI
  const lfBreakdownText = generateLfBreakdownText(link, lfBreakdown)

  // Append cells to the row for various link attributes such as airports, model, distance, capacity, and total passengers
  // Each cell is appended with optional tooltip text, content abbreviation, icon indicator, and text alignment
  appendCell(row, srcAirportFull, srcAirportFull.slice(-4, -1))
  appendCell(row, destAirportFull, destAirportFull.slice(-4, -1))
  appendCell(row, "", abbreviateModelName(link.model), null, true)
  appendCell(row, "", `${link.distance}km`, null, false, "right")
  appendCell(
    row,
    "",
    `${link.totalCapacity} (${link.frequency})`,
    colorKeyMaps["totalCapacity"]?.get(link),
    false,
    "right"
  )
  appendCell(row, "", link.totalPassengers.toString(), colorKeyMaps["totalPassengers"]?.get(link), false, "right")

  // Iterate over cells and append cells with conditional styling
  const keys = [
    "totalLoadFactor",
    "satisfaction",
    "revenue",
    "profit",
    "profitMarginPercent",
    "profitPerPax",
    "profitPerFlight",
    "profitPerHour"
  ]
  const contents = [
    `${lfBreakdownText}%`,
    `${Math.round(link.satisfaction * 100)}%`,
    formatCurrency(link.revenue),
    formatCurrency(link.profit),
    `${link.profitMargin > 0 ? "+" : ""}${Math.round(link.profitMargin)}%`,
    formatCurrency(link.profitPerPax),
    formatCurrency(link.profitPerFlight),
    formatCurrency(link.profitPerHour)
  ]

  const minMaxArgs = [[0, 100], [0, 1], [], [], [0, 136.5], [], [], []]
  keys.forEach((key, index) => {
    // Determine the cell styling based on the link's values and min/max arguments
    const styleObject = getKeyedStyleFromLink(colorKeyMaps, link, key, ...minMaxArgs[index])
    let styleString = ""

    // Construct the style string based on what's defined in styleObject
    if (styleObject.color) {
      styleString += `color: ${styleObject.color}; `
    }

    if (styleObject.fontWeight) {
      styleString += `font-weight: ${styleObject.fontWeight};`
    }

    // Append the cell with the calculated styling
    appendCell(row, "", contents[index], styleString, false, "right")
  })

  // Calculate the overall rank of the link based on its tier values and color the row based on the rank
  link.tiersRank = Object.keys(link.tiers || {}).reduce(
    (sum, key) => sum + link.tiers[key] + (key === "profit" && link.tiers[key] === 0 ? -1 : 0),
    0
  )

  if (link.tiersRank < 2) {
    row.style.backgroundColor = "rgba(0,153,51, 0.3)"
  }

  if (link.tiersRank > 27) {
    row.style.backgroundColor = "rgba(204, 51, 51, 0.3)"
  }

  // Add a cell to the start of the row with the rank value
  prependCell(row, link.tiersRank.toString(), link.tiersRank.toString())

  // Highlight the row if this link is currently selected -- Highlight the selected link
  if (window.selectedLink === link.id) {
    row.classList.add("selected")
  }
}

// This function prepends a cell to the given row with optional tooltip, alignment, and style
function prependCell(
  row: HTMLDivElement,
  title: string,
  text: string,
  isEllipsis: boolean = false,
  align: "left" | "right" = "left",
  style?: string
): void {
  const cell = createCell(title, text, align, isEllipsis, style)
  row.insertBefore(cell, row.firstChild)
}

// This function changes the selected link in the UI and updates the link details view accordingly
function selectLinkFromTable(row: HTMLDivElement, linkId: number): void {
  window.selectedLink = linkId

  const siblings = Array.from(row.parentElement?.children ?? [])
  siblings.forEach((sibling) => sibling.classList.remove("selected"))
  row.classList.add("selected")

  window.refreshLinkDetails(linkId)
}

// This function updates the links table with sorted links
export function updateLinksTable(sortProperty: string, sortOrder: string) {
  const colorKeyMaps: Record<string, WeakMap<Link, any>> = {} // Object to hold color maps for various keys
  const linksTable = window.document.querySelector("#linksCanvas #linksTable") // Reference to the table element in the DOM

  if (linksTable) {
    linksTable.innerHTML = "" // Clear the existing table content
  }

  // Sort the links and update the loaded links
  const orderedLinks = window.sortPreserveOrder(window.loadedLinks, sortProperty, sortOrder === "ascending")
  window.loadedLinks = orderedLinks

  // Create a new row for each link and append it to the table
  window.loadedLinks.forEach((link: Link) => {
    const row = createLinkRow(colorKeyMaps, link)
    
    linksTable?.appendChild(row)
  })
}
