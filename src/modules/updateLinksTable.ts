import { appendCell, prependCell } from "~/helpers/tables"
import { selectLinkFromTable } from "~/helpers/tables"
import { getShortModelName } from "~/helpers/tables"
import { getStyleFromTier, getTierFromPercent } from "~/helpers/utils"

export function updateLinksTable(sortProperty: string, sortOrder: string) {
  let colorKeyMaps: { [key: string]: WeakMap<Link, any> } = {}
  const linksTable = window.document.querySelector("#linksCanvas #linksTable")
  while (linksTable?.firstChild) {
    linksTable.removeChild(linksTable.firstChild)
  }

  window.loadedLinks = window.sortPreserveOrder(window.loadedLinks, sortProperty, sortOrder == "ascending")

  function getKeyedStyleFromLink(link: Link, keyName: string, ...args: number[]): any {
    if (!colorKeyMaps[keyName]) {
      colorKeyMaps[keyName] = new WeakMap<Link, any>()
    } else if (colorKeyMaps[keyName].has(link)) {
      return colorKeyMaps[keyName].get(link)
    }

    const data = window.loadedLinks.map((l) => l[keyName])

    const avg = data.reduce((sum, acc) => (sum += acc), 0) / window.loadedLinks.length
    const max = Math.max(...data)
    const min = Math.max(Math.min(...data), 0)

    const tier = getTierFromPercent(link[keyName], args[0] !== undefined ? args[0] : min, args[1] || avg * 0.618)
    if (!link.tiers) {
      link.tiers = {}
    }

    link.tiers[keyName] = tier

    const stylesFromGoodToBad = [
      "color:#29FF66;",
      "color:#5AB874;",
      "color:inherit;",
      "color:#FA8282;",
      "color:#FF6969;",
      "color:#FF3D3D;font-weight: bold;"
    ]

    const colorResult = getStyleFromTier(tier)

    colorKeyMaps[keyName].set(link, colorResult)

    return colorResult
  }

  window.loadedLinks.forEach((link: Link, index: number) => {
    const row = window.document.createElement("div")
    row.className = "table-row clickable"
    row.onclick = () => selectLinkFromTable(row, link.id)

    const srcAirportFull = window.getAirportText(link.fromAirportCity, link.fromAirportCode)
    const destAirportFull = window.getAirportText(link.toAirportCity, link.toAirportCode)

    appendCell(
      row,
      srcAirportFull,

      srcAirportFull.slice(-4, -1)
    )
    appendCell(
      row,
      destAirportFull,

      destAirportFull.slice(-4, -1)
    )
    appendCell(row, "", getShortModelName(link.model), true)
    appendCell(row, "", link.distance + "km", false, "right")
    appendCell(row, "", link.totalCapacity + " (" + link.frequency + ")", false, "right")
    appendCell(row, "", link.totalPassengers.toString(), false, "right")

    const lfBreakdown = {
      economy: link.passengers.economy / link.capacity.economy,
      business: link.passengers.business / link.capacity.business,
      first: link.passengers.first / link.capacity.first
    }

    let lfBreakdownText =
      link.totalLoadFactor === 100
        ? "100"
        : [lfBreakdown.economy, lfBreakdown.business, lfBreakdown.first]
            .map((v) => (v ? Math.floor(100 * v) : "-"))
            .join("/")

    appendCell(row, "", lfBreakdownText + "%", false, "right", getKeyedStyleFromLink(link, "totalLoadFactor", 0, 100))
    appendCell(
      row,
      "",
      Math.round(link.satisfaction * 100) + "%",
      false,
      "right",
      getKeyedStyleFromLink(link, "satisfaction", 0, 1)
    )
    appendCell(
      row,
      "$" + new Intl.NumberFormat("en-US").format(link.revenue),
      "$" + new Intl.NumberFormat("en-US").format(link.revenue),
      false,
      "right",
      getKeyedStyleFromLink(link, "revenue")
    )
    appendCell(
      row,
      "$" + new Intl.NumberFormat("en-US").format(link.profit),
      "$" + new Intl.NumberFormat("en-US").format(link.profit),
      false,
      "right",
      getKeyedStyleFromLink(link, "profit")
    )
    appendCell(
      row,
      "",
      (link.profitMargin > 0 ? "+" : "") + Math.round(link.profitMargin) + "%",
      false,
      "right",
      getKeyedStyleFromLink(link, "profitMarginPercent", 0, 136.5)
    )
    appendCell(
      row,
      "$" + new Intl.NumberFormat("en-US").format(link.profitPerPax),
      "$" + new Intl.NumberFormat("en-US").format(link.profitPerPax),
      false,
      "right",
      getKeyedStyleFromLink(link, "profitPerPax")
    )
    appendCell(
      row,
      "$" + new Intl.NumberFormat("en-US").format(link.profitPerFlight),
      "$" + new Intl.NumberFormat("en-US").format(link.profitPerFlight),
      false,
      "right",
      getKeyedStyleFromLink(link, "profitPerFlight")
    )
    appendCell(
      row,
      "$" + new Intl.NumberFormat("en-US").format(link.profitPerHour),
      "$" + new Intl.NumberFormat("en-US").format(link.profitPerHour),
      false,
      "right",
      getKeyedStyleFromLink(link, "profitPerHour")
    )

    if (window.selectedLink === link.id) {
      row.classList.add("selected")
    }

    const tiersRank = (link.tiersRank = Object.keys(link.tiers || {}).reduce(
      (sum, key) => sum + link.tiers[key] + (key === "profit" && link.tiers[key] === 0 ? -1 : 0),
      0
    ))

    prependCell(row, "", link.tiersRank.toString())

    if (tiersRank < 2) {
      row.style.textShadow = "0 0 3px gold"
    }

    if (tiersRank > 27) {
      row.style.textShadow = "0 0 3px red"
    }

    linksTable.appendChild(row)
  })
}
