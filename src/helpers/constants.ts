// TABLE_HEADER_WIDTHS: Percentages specifying the width of each column.
// SUPERSONIC_SPEED_FACTOR: Represents the speed of supersonic aircraft types.
// SPEED_FACTORS: Maximum speed values for different phases of a flight, or different types of aircraft.
// STYLES_FROM_GOOD_TO_BAD: Used to visually indicate data performance (e.g., green for good, red for bad).
// TABLE_HEADERS: Each column has a className (CSS class for styling), style (inline CSS style, with width derived from TABLE_HEADER_WIDTHS), sortProperty (data attribute by which to sort), sortOrder (initial sort direction), onClick (JavaScript function to call when the column header is clicked), title (tooltip text), and content (visible text in the header cell).

export namespace Constants {
  const TABLE_HEADER_WIDTHS = [8, 8, 8, 7, 9, 5, 5, 5, 9, 8, 6, 6, 7, 7, 2]
  export const SUPERSONIC_SPEED_FACTOR = 1.5 // Speed factor for SUPERSONIC type
  export const SPEED_FACTORS = [350, 500, 700] // Maximum speeds for different phases of flight
  export const STYLES_FROM_GOOD_TO_BAD: Array<{ color: string; fontWeight?: string }> = [
    { color: "#29FF66" },
    { color: "#5AB874" },
    { color: "inherit" },
    { color: "#FA8282" },
    { color: "#FF6969" },
    { color: "#FF3D3D", fontWeight: "bold" }
  ]

  export const TABLE_HEADERS = [
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[14]}%`,
      sortProperty: "tiersRank",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Aggregated Rank",
      content: "#"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[0]}%`,
      sortProperty: "fromAirportCode",
      sortOrder: "descending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "From",
      content: "From"
    },
    {
      className: "cell clickable",
      style: `width: 0%`,
      sortProperty: "lastUpdate",
      sortOrder: "ascending",
      onClick: "",
      title: "",
      content: ""
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[1]}%`,
      sortProperty: "toAirportCode",
      sortOrder: "descending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "To",
      content: "To"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[2]}%`,
      sortProperty: "model",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Model",
      content: "Model"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[3]}%`,
      sortProperty: "distance",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Distance",
      content: "Dist."
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[4]}%`,
      sortProperty: "totalCapacity",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Capacity (Freq.)",
      content: "Capacity (Freq.)"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[5]}%`,
      sortProperty: "totalPassengers",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Passengers",
      content: "Pax"
    },
    {
      className: "cell clickable selected",
      style: `width: ${TABLE_HEADER_WIDTHS[6]}%`,
      sortProperty: "totalLoadFactor",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Load Factor",
      content: "LF"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[7]}%`,
      sortProperty: "satisfaction",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Satisfaction Factor",
      content: "SF"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[8]}%`,
      sortProperty: "revenue",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Revenue",
      content: "Revenue"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[9]}%`,
      sortProperty: "profit",
      sortOrder: "descending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Profit",
      content: "Profit"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[10]}%`,
      sortProperty: "profitMargin",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "Gain",
      content: "Gain"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[11]}%`,
      sortProperty: "profitPerPax",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "$/🧍",
      content: "$/🧍"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[12]}%`,
      sortProperty: "profitPerFlight",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "$/✈",
      content: "$/✈"
    },
    {
      className: "cell clickable",
      style: `width: ${TABLE_HEADER_WIDTHS[13]}%`,
      sortProperty: "profitPerHour",
      sortOrder: "ascending",
      onClick: "toggleLinksTableSortOrder(this)",
      title: "$/⏲",
      content: "$/⏲"
    }
  ]
}
