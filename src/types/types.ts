export interface Link {
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

export interface Capacity {
  economy: number
  business: number
  first: number
}

export interface AssignedAirplane {
  airplane: Airplane
}

export interface Airplane {
  name: string
}

export interface ActiveAirline {
  id: number
}

export interface DataSourceEntry {
  [key: string]: any
}

export interface averageFromSubKey {
  [key: string]: any
}

export type EntryType = {
  label: string
  value: any
  color?: string
  issliced?: string
}
