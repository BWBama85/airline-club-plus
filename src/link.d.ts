interface Link {
  id?: number // Unique identifier for the link
  assignedAirplanes?: AssignedAirplane[] // Array of airplanes assigned to the link
  capacity?: Capacity // Capacity of the link
  capacityHistory?: Capacity // Historical data about the capacity of the link
  distance?: number // Distance covered by the link
  duration?: number // Duration of travel across the link
  frequency?: number // Frequency of flights across the link
  fromAirportCity?: string // City of the airport from where the link starts
  fromAirportCode?: string // Code of the airport from where the link starts
  model?: string // Model of the airplane assigned to the link
  passengers?: Capacity // Capacity for passengers in the link
  previousOrder?: number
  profit?: number // Profit generated from the link
  profitMarginPercent?: number // Profit margin percentage of the link
  profitMargin?: number // Profit margin of the link
  profitPerPax?: number // Profit per passenger from the link
  profitPerFlight?: number // Profit per flight across the link
  profitPerHour?: number // Profit per hour of operation on the link
  revenue?: number // Revenue generated from the link
  satisfaction?: number // Satisfaction score of passengers for the link
  tiers?: { [key: string]: number } // Tiers data for the link
  tiersRank?: number // Ranking of the link based on tiers
  toAirportCity?: string // City of the airport to where the link ends
  toAirportCode?: string // Code of the airport to where the link ends
  totalCapacity?: number // Total capacity across the link
  totalCapacityHistory?: number // Historical data about the total capacity across the link
  totalPassengers?: number // Total number of passengers who have travelled across the link
  totalLoadFactor?: number // Total load factor for the link
}

// AssignedAirplane interface defines the structure of an AssignedAirplane object
interface AssignedAirplane {
  airplane: Plane // Plane object for the airplane assigned to a Link
}
