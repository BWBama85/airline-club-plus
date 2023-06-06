import FusionCharts from "fusioncharts"

import type { EntryType } from "~types/types"

const stringHashCode = (s: string): number => {
  let h = 0
  const l = s.length
  let i = 0
  if (l > 0) {
    while (i < l) {
      h = ((h << 5) - h + s.charCodeAt(i++)) | 0
    }
  }
  return h
}

const colorFromString = (s: string): string => {
  const rgbMask = 0b11111111
  let hashCode = stringHashCode(s)
  let r = hashCode & rgbMask
  hashCode = hashCode >> 2
  let g = hashCode & rgbMask
  hashCode = hashCode >> 2
  let b = hashCode & rgbMask

  if (r < 64 && g < 64 && b < 64) {
    r *= 2
    g *= 2
    b *= 2
  }

  const rr = r.toString(16).padStart(2, "0")
  const gg = g.toString(16).padStart(2, "0")
  const bb = b.toString(16).padStart(2, "0")

  return `#${rr}${gg}${bb}`
}

const defaultPieColors = {
  Business: "#2e287d",
  Tourist: "#fc7a57",
  Olympics: "#c8d143",
  Budget: "#c8d143",
  Carefree: "#b287a3",
  Swift: "#ff5a5f",
  Comprehensive: "#9bf3f0",
  "Brand Conscious": "#fc7a57",
  Elite: "#2e287d",
  "departure/arrival passengers": "#FC7A57",
  "transit passengers": "#9BF3F0"
}

export const plotPie = (
  dataSource: any,
  currentKey: string,
  containerElement: HTMLElement,
  keyName: string,
  valueName: string
) => {
  const data: EntryType[] = []

  for (const key in dataSource) {
    if (dataSource.hasOwnProperty(key)) {
      const dataEntry = dataSource[key]
      let keyLabel: string
      let dataValue: any

      if (keyName && valueName) {
        keyLabel = dataEntry[keyName]
        dataValue = dataEntry[valueName]
      } else {
        keyLabel = key
        dataValue = dataEntry
      }

      const entry: EntryType = { label: keyLabel, value: dataValue }

      if (dataEntry.color) {
        entry.color = dataEntry.color
      } else if (defaultPieColors[keyLabel]) {
        entry.color = defaultPieColors[keyLabel]
      } else {
        entry.color = colorFromString(keyLabel)
      }

      if (currentKey && keyLabel === currentKey) {
        entry.issliced = "1"
      }

      data.push(entry)
    }
  }

  data.sort((a, b) => a.value - b.value)

  const chartConfig = {
    type: "pie2d",
    renderAt: containerElement.id,
    width: "100%",
    height: "160",
    dataFormat: "json",
    dataSource: {
      chart: {
        animation: "0",
        pieRadius: "65",
        showBorder: "0",
        use3DLighting: "1",
        showPercentInTooltip: "1",
        decimals: "2",
        toolTipBorderRadius: "2",
        toolTipPadding: "5",
        showHoverEffect: "1",
        bgAlpha: "0",
        canvasBgAlpha: "0",
        showPlotBorder: "0",
        showLabels: "0",
        showValues: "0",
        plottooltext: "$label - Passengers : $datavalue ($percentValue)"
      },
      data: data
    }
  }

  // Error is currently produced, needs investigation
  // const chartInstance = new FusionCharts(chartConfig)
  // chartInstance.render()
}
