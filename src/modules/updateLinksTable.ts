import { formatCurrency, getStyleFromTier, getTierFromPercent } from "~/helpers/utils"

function appendCell(
  row: HTMLDivElement,
  title: string,
  content: string,
  style?: string,
  isEllipsis: boolean = false,
  align: "left" | "right" = "left"
): void {
  const cell = createCell(title, content, align, isEllipsis, style)
  row.appendChild(cell)
}

function createCell(
  title: string,
  content: string,
  align = "left",
  isEllipsis = false,
  style?: string
): HTMLDivElement {
  const cell = document.createElement("div")
  cell.className = "cell"
  cell.style.textAlign = align
  cell.title = title
  cell.textContent = content
  if (style) {
    cell.style.cssText = style
  }
  if (isEllipsis) {
    cell.style.textOverflow = "ellipsis"
    cell.style.overflow = "hidden"
    cell.style.whiteSpace = "pre"
  }
  return cell
}

function createLinkRow(colorKeyMaps: Record<string, WeakMap<Link, any>>, link: Link) {
  const row = window.document.createElement("div")
  row.className = "table-row clickable"
  row.onclick = () => selectLinkFromTable(row, link.id)

  populateLinkRowCells(colorKeyMaps, row, link)

  return row
}

function generateLfBreakdownText(link: Link, lfBreakdown: Record<string, number>): string {
  if (link.totalLoadFactor === 100) {
    return "100"
  }

  return Object.values(lfBreakdown)
    .map((v) => (v ? Math.floor(100 * v) : "-"))
    .join("/")
}

function getKeyedStyleFromLink(
  colorKeyMaps: Record<string, WeakMap<Link, any>>,
  link: Link,
  keyName: string,
  ...args: number[]
): { color: string; fontWeight?: string } {
  let colorKeyMap = colorKeyMaps[keyName]

  // Update the colorKeyMap reference along with the colorKeyMaps record
  if (!colorKeyMaps[keyName]) {
    colorKeyMap = colorKeyMaps[keyName] = new WeakMap<Link, any>()
  } else if (colorKeyMap.has(link)) {
    // Use the local reference
    return colorKeyMap.get(link)
  }

  const data = window.loadedLinks.map((l) => l[keyName])

  const avg = data.reduce((sum, acc) => (sum += acc), 0) / window.loadedLinks.length
  const min = Math.max(0, ...data)

  const tier = getTierFromPercent(link[keyName], args[0] ?? min, args[1] ?? avg * 0.618)

  link.tiers = link.tiers || {}
  link.tiers[keyName] = tier

  const colorResult = getStyleFromTier(tier)
  colorKeyMap.set(link, colorResult)

  return colorResult
}

function abbreviateModelName(airplaneName: string): string {
  const sections = airplaneName.trim().split(" ").slice(1)

  return sections
    .map((str) =>
      str.includes("-") || str.length < 4 || /^[A-Z0-9\-]+[a-z]{0,4}$/.test(str) ? str : str[0].toUpperCase()
    )
    .join(" ")
}

function populateLinkRowCells(colorKeyMaps: Record<string, WeakMap<Link, any>>, row: HTMLDivElement, link: Link): void {
  // Get full source and destination airports
  const srcAirportFull = window.getAirportText(link.fromAirportCity, link.fromAirportCode)
  const destAirportFull = window.getAirportText(link.toAirportCity, link.toAirportCode)

  // Calculate load factor breakdown
  const { economy, business, first } = link.passengers
  const { economy: capacityEconomy, business: capacityBusiness, first: capacityFirst } = link.capacity
  const lfBreakdown = {
    economy: economy / capacityEconomy,
    business: business / capacityBusiness,
    first: first / capacityFirst
  }

  const lfBreakdownText = generateLfBreakdownText(link, lfBreakdown)

  // Append cells for various attributes
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

  // Append cells with styling
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
    const styleObject = getKeyedStyleFromLink(colorKeyMaps, link, key, ...minMaxArgs[index])
    let styleString = ""

    // Construct the style string based on what's defined in styleObject
    if (styleObject.color) {
      styleString += `color: ${styleObject.color}; `
    }

    if (styleObject.fontWeight) {
      styleString += `font-weight: ${styleObject.fontWeight};`
    }

    appendCell(row, "", contents[index], styleString, false, "right")
  })

  // Calculate rank and apply styling
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

  prependCell(row, link.tiersRank.toString(), link.tiersRank.toString())

  // Highlight the selected link
  if (window.selectedLink === link.id) {
    row.classList.add("selected")
  }
}

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

function selectLinkFromTable(row: HTMLDivElement, linkId: number): void {
  window.selectedLink = linkId

  const siblings = Array.from(row.parentElement?.children ?? [])
  siblings.forEach((sibling) => sibling.classList.remove("selected"))
  row.classList.add("selected")

  window.refreshLinkDetails(linkId)
}

export function updateLinksTable(sortProperty: string, sortOrder: string) {
  const colorKeyMaps: Record<string, WeakMap<Link, any>> = {}
  const linksTable = window.document.querySelector("#linksCanvas #linksTable")

  if (linksTable) {
    linksTable.innerHTML = ""
  }

  const orderedLinks = window.sortPreserveOrder(window.loadedLinks, sortProperty, sortOrder === "ascending")
  window.loadedLinks = orderedLinks

  window.loadedLinks.forEach((link: Link) => {
    const row = createLinkRow(colorKeyMaps, link)

    linksTable?.appendChild(row)
  })
}
