// Import types, hooks and utility functions
import type { PlasmoCSUIProps } from "plasmo"
import { useEffect, useMemo, useState } from "react"
import type { FC } from "react"

import { Storage } from "@plasmohq/storage"

import { formatCurrency, getStyleFromTier, getTierFromPercent } from "~helpers/utils"

// Create a new storage instance
const storage = new Storage()

// Define OilOverlay component
const OilOverlay: FC<PlasmoCSUIProps> = () => {
  // Initialize state with oilPrice and className
  const [state, setState] = useState({
    oilPrice: undefined,
    className: "latestOilPriceShortCut clickable"
  })

  // On component mount, get oilData from storage and update state accordingly
  useEffect(() => {
    const checkLocalStorageAndUpdate = async () => {
      const oilData = (await storage.get("oilData")) as OilData[]
      if (oilData) {
        const latestPrice = oilData.slice(-1)[0].price
        const tierForPrice = 5 - getTierFromPercent(latestPrice, 40, 80)
        setState({
          oilPrice: latestPrice,
          className: tierForPrice < 2 ? "latestOilPriceShortCut clickable glow" : "latestOilPriceShortCut clickable"
        })
      }
    }

    // Call the function immediately
    checkLocalStorageAndUpdate()

    // Then, set an interval to call it every 60 seconds
    const intervalId = setInterval(checkLocalStorageAndUpdate, 60000)
    // When the component unmounts, clear the interval
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  // Determine the oil price style
  const oilPriceStyle = useMemo(
    () => getStyleFromTier(state.oilPrice ? 5 - getTierFromPercent(state.oilPrice, 40, 80) : undefined),
    [state.oilPrice]
  )

  // Render the component
  return (
    <span
      style={{ marginLeft: 10, position: "relative", display: "inline-block" }}
      className={state.className}
      title="Latest Oil Price">
      <span className="latest-price label" style={{ ...oilPriceStyle }}>
        {state.oilPrice ? `${formatCurrency(state.oilPrice)}` : "Loading..."}
      </span>
    </span>
  )
}

export default OilOverlay
