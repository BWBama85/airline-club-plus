// Airline interface defines the structure of an Airline object
interface Airline {
  baseCount: number  // Number of bases that the airline has
  gradeValue: number  // The value of the grade of the airline
  isGenerated: boolean  // If true, the airline was generated by the system, if false, it's user-created
  countryCode: string  // The code of the country where the airline is based
  gradeDescription: string  // Description of the airline's grade
  name: string  // Name of the airline
  reputation: number  // Reputation score of the airline
  airlineCode: string  // Code of the airline
  id: number  // Unique identifier of the airline
}

// Capacity interface defines the capacity of a plane across different classes
interface Capacity {
  economy: number  // Capacity in economy class
  business: number  // Capacity in business class
  first: number  // Capacity in first class
}

// Favorite interface contains information about the favorite selection
interface Favorite {
  rejection: string  // Reason for rejection, if applicable
}

// Opts interface defines options that might be used when calling certain functions
interface Opts {
  totalOnly?: boolean  // If true, only the total count is considered
}

// Stats interface defines the structure of a Stats object
interface Stats {
  favorite: Favorite  // Favorite item
  total: number  // Total number of items
  topAirlines: TopAirlines[]  // Array of top airlines
}

// TopAirlines interface defines the structure of a TopAirlines object
interface TopAirlines {
  airline: Airline  // Airline object
  airplaneCount: number  // Count of airplanes owned by the airline
}

// SortableObject type defines a general type that can be sorted
type SortableObject = {
  [key: string]: any  // Key-value pairs where key is a string and value can be any type
}

// OilData interface defines the structure of an OilData object
interface OilData {
  cycle: number  // The cycle of the oil price
  price: number  // The price of oil
}
