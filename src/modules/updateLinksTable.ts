import { appendCell, getShortModelName, prependCell, selectLinkFromTable } from "~/helpers/tables"
import { getStyleFromTier, getTierFromPercent } from "~/helpers/utils"

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

function getKeyedStyleFromLink(
  colorKeyMaps: Record<string, WeakMap<Link, any>>,
  link: Link,
  keyName: string,
  ...args: number[]
): any {
  if (!colorKeyMaps[keyName]) {
    colorKeyMaps[keyName] = new WeakMap<Link, any>()
  } else if (colorKeyMaps[keyName].has(link)) {
    return colorKeyMaps[keyName].get(link)
  }

  const data = window.loadedLinks.map((l) => l[keyName])
  const avg = data.reduce((sum, acc) => (sum += acc), 0) / window.loadedLinks.length
  const min = Math.max(0, ...data)

  const tier = getTierFromPercent(link[keyName], args[0] !== undefined ? args[0] : min, args[1] || avg * 0.618)
  link.tiers = link.tiers || {}
  link.tiers[keyName] = tier

  const colorResult = getStyleFromTier(tier)
  colorKeyMaps[keyName].set(link, colorResult)

  return colorResult
}

function createLinkRow(colorKeyMaps: Record<string, WeakMap<Link, any>>, link: Link) {
  const row = window.document.createElement("div")
  row.className = "table-row clickable"
  row.onclick = () => selectLinkFromTable(row, link.id)

  populateLinkRowCells(colorKeyMaps, row, link)

  return row
}

function populateLinkRowCells(colorKeyMaps: Record<string, WeakMap<Link, any>>, row: HTMLDivElement, link: Link) {
  const srcAirportFull = window.getAirportText(link.fromAirportCity, link.fromAirportCode)
  const destAirportFull = window.getAirportText(link.toAirportCity, link.toAirportCode)
  const lfBreakdown = {
    economy: link.passengers.economy / link.capacity.economy,
    business: link.passengers.business / link.capacity.business,
    first: link.passengers.first / link.capacity.first
  }

  const lfBreakdownText = generateLfBreakdownText(link, lfBreakdown)

  appendCell(row, srcAirportFull, srcAirportFull.slice(-4, -1))
  appendCell(row, destAirportFull, destAirportFull.slice(-4, -1))
  appendCell(row, "", getShortModelName(link.model), true)
  appendCell(row, "", link.distance + "km", false, "right")
  appendCell(row, "", link.totalCapacity + " (" + link.frequency + ")", false, "right")
  appendCell(row, "", link.totalPassengers.toString(), false, "right")
  appendCell(
    row,
    "",
    lfBreakdownText + "%",
    false,
    "right",
    getKeyedStyleFromLink(colorKeyMaps, link, "totalLoadFactor", 0, 100)
  )
  appendCell(
    row,
    "",
    Math.round(link.satisfaction * 100) + "%",
    false,
    "right",
    getKeyedStyleFromLink(colorKeyMaps, link, "satisfaction", 0, 1)
  )
  appendCell(
    row,
    formatCurrency(link.revenue),
    formatCurrency(link.revenue),
    false,
    "right",
    getKeyedStyleFromLink(colorKeyMaps, link, "revenue")
  )
  appendCell(
    row,
    formatCurrency(link.profit),
    formatCurrency(link.profit),
    false,
    "right",
    getKeyedStyleFromLink(colorKeyMaps, link, "profit")
  )
  appendCell(
    row,
    "",
    (link.profitMargin > 0 ? "+" : "") + Math.round(link.profitMargin) + "%",
    false,
    "right",
    getKeyedStyleFromLink(colorKeyMaps, link, "profitMarginPercent", 0, 136.5)
  )
  appendCell(
    row,
    formatCurrency(link.profitPerPax),
    formatCurrency(link.profitPerPax),
    false,
    "right",
    getKeyedStyleFromLink(colorKeyMaps, link, "profitPerPax")
  )
  appendCell(
    row,
    formatCurrency(link.profitPerFlight),
    formatCurrency(link.profitPerFlight),
    false,
    "right",
    getKeyedStyleFromLink(colorKeyMaps, link, "profitPerFlight")
  )
  appendCell(
    row,
    formatCurrency(link.profitPerHour),
    formatCurrency(link.profitPerHour),
    false,
    "right",
    getKeyedStyleFromLink(colorKeyMaps, link, "profitPerHour")
  )

  link.tiersRank = Object.keys(link.tiers || {}).reduce(
    (sum, key) => sum + link.tiers[key] + (key === "profit" && link.tiers[key] === 0 ? -1 : 0),
    0
  )

  if (link.tiersRank < 2) {
    row.style.textShadow = "0 0 3px gold"
  }

  if (link.tiersRank > 27) {
    row.style.textShadow = "0 0 3px red"
  }

  prependCell(row, link.tiersRank.toString(), link.tiersRank.toString())
  if (window.selectedLink === link.id) {
    row.classList.add("selected")
  }
}

function formatCurrency(num: number): string {
  return "$" + new Intl.NumberFormat("en-US").format(num)
}

function generateLfBreakdownText(link: Link, lfBreakdown: Record<string, number>): string {
  if (link.totalLoadFactor === 100) {
    return "100"
  }

  return Object.values(lfBreakdown)
    .map((v) => (v ? Math.floor(100 * v) : "-"))
    .join("/")
}
