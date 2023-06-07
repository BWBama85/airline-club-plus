interface Window {
  $: JQueryStatic
  updateCustomLinkTableHeader: () => void
  refreshLinkDetails: (LinkId: number) => Promise<void>
  updateLoadedLinks: (links: Link[]) => void
  loadLinksTable: () => Promise<void>
  getAirportText: (city: string, code: string) => string
  sortPreserveOrder: (links: Link[], sortProperty: string, ascending: boolean) => Link[]
  getLoadFactorsFor: (consumption: Link) => number[]
  toggleLinksTableSortOrder: (sortHeader: HTMLElement) => void
  selectedLink: number
  link: Link
  loadedLinks: Link[]
  activeAirline?: ActiveAirline
}

interface Link {
  id?: number
  fromAirportId?: number
  fromAirportCity?: string
  fromAirportCode?: string
  fromCountryCode?: string
  toAirportId?: number
  toAirportCity?: string
  toAirportCode?: string
  toCountryCode?: string
  flightCode?: string
  flightType?: string
  computedQuality?: number
  future?: any
  price?: number
  distance?: number
  satisfaction?: number
  frequency?: number
  duration?: number
  model?: string
  capacity?: Capacity
  capacityHistory?: Capacity
  passengers?: Capacity
  soldSeats?: Capacity
  totalCapacity?: number
  totalCapacityHistory?: number
  totalPassengers?: number
  totalLoadFactor?: number
  assignedAirplanes?: AssignedAirplane[]
  revenue?: number
  profit?: number
  profitMarginPercent?: number
  profitMargin?: number
  profitPerPax?: number
  profitPerFlight?: number
  profitPerHour?: number
  tiers?: { [key: string]: any }
  tiersRank?: number
}

interface Capacity {
  economy: number
  business: number
  first: number
}

interface AssignedAirplane {
  airplane: Airplane
}

interface Airplane {
  name: string
}

interface ActiveAirline {
  id: number
}

interface DataSourceEntry {
  [key: string]: any
}

interface averageFromSubKey {
  [key: string]: any
}

type EntryType = {
  label: string
  value: any
  color?: string
  issliced?: string
}
