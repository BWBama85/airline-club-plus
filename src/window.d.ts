interface Window {
  $: JQueryStatic
  getAirportText: (city: string, code: string) => string // Function to get a formatted string representing an airport, given its city and code
  loadAirplaneModelStats: (modelInfo: Plane, opts?: Opts) => Promise<void> // Function to load and process data for a given airplane model
  loadLinksTable: () => Promise<void> // Function to load the links table
  refreshLinkDetails: (LinkId: number) => Promise<void> // Function to refresh link details for a specific link, identified by its ID
  selectAirplaneModel: (modelInfo: Plane) => void // Function to select an airplane model for detailed view
  sortPreserveOrder: (links: Link[], sortProperty: string, ascending: boolean) => Link[] // Function to sort an array of links while preserving the current order of equivalent items
  toggleAirplaneModelTableSortOrder: (sortHeader: HTMLElement) => void // Function to toggle the sort order of the airplane model table based on a clicked header
  toggleLinksTableSortOrder: (sortHeader: HTMLElement) => void // Function to toggle the sort order of the links table based on a clicked header
  updateAirplaneModelTable: (sortProperty: string, sortOrder: string) => void // Function to update the airplane model table based on a specified sort property and order
  updateLoadedLinks: (links: Link[]) => void // Function to update the links currently loaded into memory
  updateTopOperatorsTable: (stats: Stats) => void // Function to update the top operators table with new statistical data
  activeAirline?: ActiveAirline // The active airline, identified by its ID
  link: Link // A link object, representing a connection between two airports
  loadedLinks: Link[] // An array of all the links currently loaded into memory
  loadedModelsById: { [key: string]: Plane } // A mapping of airplane model IDs to their corresponding model objects
  loadedModelsOwnerInfo: Plane[] // An array of airplane models currently owned by the user
  selectedLink: number // The ID of the currently selected link
}

// Interface to describe the active airline using its unique identifier
interface ActiveAirline {
  id: number
}
