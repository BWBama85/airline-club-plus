interface Window {
  $: JQueryStatic
  getAirportText: (city: string, code: string) => string
  loadLinksTable: () => Promise<void>
  refreshLinkDetails: (LinkId: number) => Promise<void>
  sortPreserveOrder: (links: Link[], sortProperty: string, ascending: boolean) => Link[]
  toggleLinksTableSortOrder: (sortHeader: HTMLElement) => void
  updateLoadedLinks: (links: Link[]) => void
  activeAirline?: ActiveAirline
  link: Link
  loadedLinks: Link[]
  selectedLink: number
}

interface Link {
  id?: number
  assignedAirplanes?: AssignedAirplane[]
  capacity?: Capacity
  capacityHistory?: Capacity
  distance?: number
  duration?: number
  frequency?: number
  fromAirportCity?: string
  fromAirportCode?: string
  model?: string
  passengers?: Capacity
  profit?: number
  profitMarginPercent?: number
  profitMargin?: number
  profitPerPax?: number
  profitPerFlight?: number
  profitPerHour?: number
  revenue?: number
  satisfaction?: number
  tiers?: { [key: string]: any }
  tiersRank?: number
  toAirportCity?: string
  toAirportCode?: string
  totalCapacity?: number
  totalCapacityHistory?: number
  totalPassengers?: number
  totalLoadFactor?: number
}

interface ActiveAirline {
  id: number
}

interface Airplane {
  name: string
}

interface AssignedAirplane {
  airplane: Airplane
}

interface Capacity {
  economy: number
  business: number
  first: number
}
