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
  duration?: number
  frequency?: number
  model?: string
  passengers?: Capacity
  profit?: number
  profitMarginPercent?: number
  profitMargin?: number
  profitPerPax?: number
  profitPerFlight?: number
  profitPerHour?: number
  revenue?: number
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
