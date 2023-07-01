interface Plane {
  id: number  // Unique identifier for the plane
  airplaneType: string  // The type of the airplane
  assignedAirplanes?: Plane[]  // Array of assigned airplanes
  availableAirplanes?: Plane[]  // Array of available airplanes
  badConditionThreshold: number  // Threshold below which the plane is considered in bad condition
  capacity: number  // The carrying capacity of the plane
  condition: number  // The current condition of the plane
  configurationId: number  // The identifier for the plane's current configuration
  configuration: Capacity  // The plane's current configuration
  constructingAirplanes?: Plane[]  // Array of airplanes currently under construction
  constructedCycle: number  // The number of construction cycles completed for the plane
  constructionTime: number  // The total time required to construct the plane
  countryCode: string  // The country code of the plane's home country
  cpp: number  // The cost per pax
  criticalConditionThreshold: number  // Threshold below which the plane is considered in critical condition
  dealerValue: number  // The dealer's valuation of the plane
  dealerRatio: number  // The ratio of the plane's value to the dealer's valuation
  discounts: Discounts  // Any applicable discounts
  family: string  // The family the plane model belongs to
  fbpf: number  // Fuel burn per flight
  fbpp: number  // Fuel burn per pax
  fbpw: number  // Fuel burn per weight
  fuelBurn: number  // Total fuel burn
  fuel_total: number  // Total fuel capacity
  fuel_total_info: string  // String representation of total fuel information
  homeAirportId: number  // The identifier of the plane's home airport
  imageUrl: string  // URL of the plane's image
  in_use: number | undefined | null  // Number of this type of plane currently in use, or undefined/null if not known
  isFavorite?: boolean  // If the plane is marked as favorite
  isReady: boolean  // If the plane is ready for operation
  lifespan: number  // The lifespan of the plane
  runwayRequirement: number  // The length of runway required for the plane
  manufacturer: string  // The manufacturer of the plane
  max_rotation: number  // Maximum rotation speed
  max_capacity: number  // Maximum carrying capacity
  maxFlightMinutes: number  // Maximum minutes the plane can fly
  modelId: number  // The identifier of the plane's model
  name: string  // The name of the plane
  originalConstructionTime: number  // The original construction time of the plane
  originalPrice: number  // The original price of the plane
  ownerId: number  // The identifier of the plane's owner
  ownerName: string  // The name of the plane's owner
  price: number  // The current price of the plane
  purchasedCycle: number  // The cycle in which the plane was purchased
  range: number  // The range of the plane
  rejection: string  // The reason for rejection of the plane, if any
  sellValue: number  // The selling value of the plane
  speed: number  // The speed of the plane
  turnaroundTime: number  // The time required for the plane to turnaround
  totalOwned: number  // The total number of this type of planes owned
  value: number  // The current value of the plane
}

// Discounts interface defines the structure of a Discounts object
interface Discounts {
  construction_time: Discount[]  // Array of discounts applicable to construction time
  price: Discount[]  // Array of discounts applicable to price
}

// Discount interface defines the structure of a Discount object
interface Discount {
  discountDescription: string  // Description of the discount
  discountPercentage: number  // The discount percentage
}
