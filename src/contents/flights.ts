import type { PlasmoCSConfig } from "plasmo"

import { loadLinksTable } from "~/modules/loadLinksTable"
import type { ActiveAirline, DataSourceEntry, Link } from "~/types/types"
import { toggleLinksTableSortOrder } from "~helpers/utils"

export const config: PlasmoCSConfig = {
  world: "MAIN",
  matches: ["https://*.airline-club.com/*"],
  run_at: "document_start"
}

declare global {
  interface Window {
    updateCustomLinkTableHeader: () => void
    refreshLinkDetails: (LinkId: number) => Promise<void>
    updateLoadedLinks: (links: Link[]) => void
    loadLinksTable: () => Promise<void>
    toLinkClassValueString: (linkValues: any, prefix?: string, suffix?: string) => string
    assignAirlineColors: (dataSet: any, colorProperty: string) => boolean
    getCountryFlagImg: (code: string) => string
    getAirportText: (city: string, code: string) => string
    sortPreserveOrder: (links: Link[], sortProperty: string, ascending: boolean) => Link[]
    selectLinkFromTable: (row: HTMLDivElement, linkId: number) => void
    disableButton: (button: HTMLButtonElement, reason?: string) => void
    enableButton: (button: HTMLButtonElement, reason?: string) => void
    plotHistory: (LinkHistory: Link) => void
    plotLinkCharts: (linkConsumption: Link, plotUnit?: any) => void
    getLoadFactorsFor: (consumption: Link) => number[]
    toggleLinksTableSortOrder: (sortHeader: HTMLElement) => void
    plotPie: (
      dataSource: { [key: string]: DataSourceEntry },
      currentKey: string,
      container: HTMLElement,
      keyName?: string,
      valueName?: string
    ) => void
    plotUnitEnum: {
      MONTH: any
      QUARTER: any
    }
    selectedLink: number
    link: Link
    loadedLinks: Link[]
    setActiveDiv: (div: HTMLElement, callback?: any) => boolean
    hideActiveDiv: (div: Element) => void
    activeAirline?: ActiveAirline
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  window.toggleLinksTableSortOrder = toggleLinksTableSortOrder
  window.loadLinksTable = loadLinksTable
})
