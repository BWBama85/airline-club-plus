interface Window {
  $: JQueryStatic
  getAirportText: (city: string, code: string) => string
  loadAirplaneModelStats: (modelInfo: Plane, opts?: Opts) => Promise<void>
  loadLinksTable: () => Promise<void>
  refreshLinkDetails: (LinkId: number) => Promise<void>
  selectAirplaneModel: (modelInfo: Plane) => void
  sortPreserveOrder: (links: Link[], sortProperty: string, ascending: boolean) => Link[]
  toggleAirplaneModelTableSortOrder: (sortHeader: HTMLElement) => void
  toggleLinksTableSortOrder: (sortHeader: HTMLElement) => void
  updateAirplaneModelTable: (sortProperty: string, sortOrder: string) => void
  updateLoadedLinks: (links: Link[]) => void
  updateTopOperatorsTable: (stats: Stats) => void
  activeAirline?: ActiveAirline
  link: Link
  loadedLinks: Link[]
  loadedModelsById: { [key: string]: Plane }
  loadedModelsOwnerInfo: Plane[]
  selectedLink: number
}

interface ActiveAirline {
  id: number
}
