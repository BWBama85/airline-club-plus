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
  tiers?: { [key: string]: number }
  tiersRank?: number
  toAirportCity?: string
  toAirportCode?: string
  totalCapacity?: number
  totalCapacityHistory?: number
  totalPassengers?: number
  totalLoadFactor?: number
}

interface AssignedAirplane {
  airplane: Plane
}
