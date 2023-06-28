interface Airline {
  baseCount: number
  gradeValue: number
  isGenerated: boolean
  countryCode: string
  gradeDescription: string
  name: string
  reputation: number
  airlineCode: string
  id: number
}

interface Capacity {
  economy: number
  business: number
  first: number
}

interface Favorite {
  rejection: string
}

interface Opts {
  totalOnly?: boolean
}

interface Stats {
  favorite: Favorite
  total: number
  topAirlines: TopAirlines[]
}

interface TopAirlines {
  airline: Airline
  airplaneCount: number
}

type SortableObject = {
  [key: string]: any
}

interface OilData {
  cycle: number
  price: number
}
