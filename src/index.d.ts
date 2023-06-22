interface Window {
  $: JQueryStatic
  getAirportText: (city: string, code: string) => string
  loadLinksTable: () => Promise<void>
  updateTopOperatorsTable: (stats: any) => void
  refreshLinkDetails: (LinkId: number) => Promise<void>
  sortPreserveOrder: (links: Link[], sortProperty: string, ascending: boolean) => Link[]
  toggleLinksTableSortOrder: (sortHeader: HTMLElement) => void
  updateLoadedLinks: (links: Link[]) => void
  selectAirplaneModel: (modelInfo) => void
  loadAirplaneModelStats: (modelInfo: ModelInfo, opts?: Opts) => Promise<void>
  updateAirplaneModelTable: (sortProperty: string, sortOrder: string) => void
  toggleAirplaneModelTableSortOrder: (sortHeader: HTMLElement) => void
  updatePlanLinkInfo: (linkInfo: LinkInfo) => void
  updateTotalValues: () => void
  updateModelInfo: (modelId: number) => void
  activeAirline?: ActiveAirline
  link: Link
  loadedLinks: Link[]
  loadedModelsOwnerInfo: { [key: string]: any }
  selectedLink: number
  selectedModelId: number
  loadedModelsById: { [key: string]: IPlane }
}

interface IPlane {
  id?: string
  airplaneType: string
  range?: number
  runwayRequirement?: number
  cpp?: number
  max_rotation?: number
  price?: number
  originalPrice?: number
  turnaroundTime?: number
  capacity?: number
  lifespan?: number
  fuel_total?: number
  fbpf?: number
  fbpp?: number
  fbpw?: number
  max_capacity?: number
  in_use?: number
  speed?: number
  fuelBurn?: number
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

// q: Explain to me what the ModelInfo interface below is doing in detail
// a: This is a type declaration for the ModelInfo object. It is saying that the ModelInfo object has two properties, id and isFavorite,

interface ModelInfo {
  id: number
  isFavorite?: boolean
}

interface Opts {
  totalOnly?: boolean
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

interface OilData {
  cycle: number
  price: number
}

type SortableObject = {
  [key: string]: any
}
