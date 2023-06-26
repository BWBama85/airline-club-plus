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
  loadedModelsOwnerInfo: Plane[]
  selectedLink: number
  selectedModelId: number
  loadedModelsById: { [key: string]: Plane }
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

interface Plane {
  runwayRequirement: number
  originalPrice: number
  airplaneType: string
  lifespan: number
  range: number
  rejection: string
  speed: number
  manufacturer: string
  capacity: number
  badConditionThreshold: number
  originalConstructionTime: number
  discounts: Discounts
  countryCode: string
  price: number
  constructionTime: number
  imageUrl: string
  name: string
  criticalConditionThreshold: number
  fuelBurn: number
  id: number
  family: string
  turnaroundTime: number
  assignedAirplanes: any[] // Replace 'any' with the correct type if known
  availableAirplanes: any[] // Replace 'any' with the correct type if known
  constructingAirplanes: any[] // Replace 'any' with the correct type if known
  totalOwned: number
  max_rotation: number
  fbpf: number
  fbpp: number
  fbpw: number
  fuel_total: number
  cpp: number
  max_capacity: number
  in_use: number | undefined | null
}

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

interface Discount {
  discountDescription: string
  discountPercentage: number
}

interface Discounts {
  construction_time: Discount[]
  price: Discount[]
}
