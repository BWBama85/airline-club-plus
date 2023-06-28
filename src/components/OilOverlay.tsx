import type { PlasmoCSUIProps } from "plasmo"
import { useEffect, useMemo, useState } from "react"
import type { FC } from "react"

import { Storage } from "@plasmohq/storage"

import { formatCurrency, getStyleFromTier, getTierFromPercent } from "~helpers/utils"

const storage = new Storage()

const OilOverlay: FC<PlasmoCSUIProps> = () => {
  const [state, setState] = useState({
    oilPrice: undefined,
    className: "latestOilPriceShortCut clickable"
  })

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

    checkLocalStorageAndUpdate()

    const intervalId = setInterval(checkLocalStorageAndUpdate, 60000) // Call the function every 60 seconds
    return () => {
      clearInterval(intervalId) // Clear the interval when the component unmounts
    }
  }, [])

  const oilPriceStyle = useMemo(
    () => getStyleFromTier(state.oilPrice ? 5 - getTierFromPercent(state.oilPrice, 40, 80) : undefined),
    [state.oilPrice]
  )

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
