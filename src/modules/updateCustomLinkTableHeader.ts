export function updateCustomLinkTableHeader(): void {
  const linksTableSortHeader = window.document.getElementById("linksTableSortHeader")
  if (linksTableSortHeader && linksTableSortHeader.children.length === 15) {
    return
  }

  const applyWidths = (selector: string, width: string): void => {
    const elements = window.document.querySelectorAll(selector)
    elements.forEach((element: HTMLElement) => {
      element.style.width = width
    })
  }

  applyWidths("#linksCanvas .mainPanel", "62%")
  applyWidths("#linksCanvas .sidePanel", "38%")
  applyWidths("#canvas .mainPanel", "62%")
  applyWidths("#canvas .sidePanel", "38%")

  const widths = [8, 8, 8, 7, 9, 5, 5, 5, 9, 8, 6, 6, 7, 7, 2]
  const sum = widths.reduce((acc, val) => acc + val, 0)

  if (sum !== 100) {
    console.warn(
      `Column widths to not add up to 100: ${sum} (${widths.join(",")}) -- ${sum < 100 ? "Remaining" : "Over by"}: ${
        sum < 100 ? 100 - sum : sum - 100
      }%`
    )
  }

  if (linksTableSortHeader) {
    linksTableSortHeader.innerHTML = `
    <div class="cell clickable" style="width: ${widths[14]}%" data-sort-property="tiersRank" data-sort-order="descending" title="Aggregated Rank">#</div>
    <div class="cell clickable" style="width: ${widths[0]}%" data-sort-property="fromAirportCode" data-sort-order="descending" onclick="toggleLinksTableSortOrder(this)">From</div>
    <div class="cell clickable" style="width: 0%" data-sort-property="lastUpdate" data-sort-order="ascending" id="hiddenLinkSortBy"></div> <!--hidden column for last update (cannot be first otherwise the left round corner would not work -->
    <div class="cell clickable" style="width: ${widths[1]}%" data-sort-property="toAirportCode" data-sort-order="descending" onclick="toggleLinksTableSortOrder(this)">To</div>
    <div class="cell clickable" style="width: ${widths[2]}%" data-sort-property="model" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">Model</div>
    <div class="cell clickable" style="width: ${widths[3]}%" align="right" data-sort-property="distance" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">Dist.</div>
    <div class="cell clickable" style="width: ${widths[4]}%" align="right" data-sort-property="totalCapacity" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">Capacity (Freq.)</div>
    <div class="cell clickable" style="width: ${widths[5]}%" align="right" data-sort-property="totalPassengers" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">Pax</div>
    <div class="cell clickable" style="width: ${widths[6]}%" align="right" data-sort-property="totalLoadFactor" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)" title="Load Factor">LF</div>
    <div class="cell clickable" style="width: ${widths[7]}%" align="right" data-sort-property="satisfaction" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)" title="Satisfaction Factor">SF</div>
    <div class="cell clickable" style="width: ${widths[8]}%" align="right" data-sort-property="revenue" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">Revenue</div>
    <div class="cell clickable selected" style="width: ${widths[9]}%" align="right" data-sort-property="profit" data-sort-order="descending" onclick="toggleLinksTableSortOrder(this)">Profit</div>
    <div class="cell clickable" style="width: ${widths[10]}%" align="right" data-sort-property="profitMargin" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">Gain</div>
    <div class="cell clickable" style="width: ${widths[11]}%" align="right" data-sort-property="profitPerPax" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">$/🧍</div>
    <div class="cell clickable" style="width: ${widths[12]}%" align="right" data-sort-property="profitPerFlight" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">$/✈</div>
    <div class="cell clickable" style="width: ${widths[13]}%" align="right" data-sort-property="profitPerHour" data-sort-order="ascending" onclick="toggleLinksTableSortOrder(this)">$/⏲</div>
    `
  }

  const linksTableHeader = window.document.querySelector("#linksTable .table-header")
  if (linksTableHeader) {
    linksTableHeader.innerHTML = `
    <div class="cell" style="width: ${widths[14]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[0]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[1]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[2]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[3]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[4]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[5]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[6]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[7]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[8]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[9]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[10]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[11]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[12]}%; border-bottom: none;"></div>
    <div class="cell" style="width: ${widths[13]}%; border-bottom: none;"></div>
    `
  }
}
