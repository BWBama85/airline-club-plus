interface Plane {
  id: number
  airplaneType: string
  assignedAirplanes?: Plane[]
  availableAirplanes?: Plane[]
  badConditionThreshold: number
  capacity: number
  condition: number
  configurationId: number
  configuration: Capacity
  constructingAirplanes?: Plane[]
  constructedCycle: number
  constructionTime: number
  countryCode: string
  cpp: number
  criticalConditionThreshold: number
  dealerValue: number
  dealerRatio: number
  discounts: Discounts
  family: string
  fbpf: number
  fbpp: number
  fbpw: number
  fuelBurn: number
  fuel_total: number
  homeAirportId: number
  imageUrl: string
  in_use: number | undefined | null
  isFavorite?: boolean
  isReady: boolean
  lifespan: number
  runwayRequirement: number
  manufacturer: string
  max_rotation: number
  max_capacity: number
  maxFlightMinutes: number
  modelId: number
  name: string
  originalConstructionTime: number
  originalPrice: number
  ownerId: number
  ownerName: string
  price: number
  purchasedCycle: number
  range: number
  rejection: string
  sellValue: number
  speed: number
  turnaroundTime: number
  totalOwned: number
  value: number
}

interface Discounts {
  construction_time: Discount[]
  price: Discount[]
}

interface Discount {
  discountDescription: string
  discountPercentage: number
}
