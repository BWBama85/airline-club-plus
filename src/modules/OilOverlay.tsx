import type { PlasmoCSUIProps } from "plasmo"
import { useEffect, useState } from "react"
import type { FC } from "react"

import { Storage } from "@plasmohq/storage"

import { getStyleFromTier, getTierFromPercent } from "~helpers/utils"

const storage = new Storage()

const OilOverlay: FC<PlasmoCSUIProps> = () => {
  const [oilPrice, setOilPrice] = useState<number>()
  const [className, setClassName] = useState("latestOilPriceShortCut clickable")

  useEffect(() => {
    const checkLocalStorageAndUpdate = async () => {
      const oilData = (await storage.get("oilData")) as OilData[]
      if (oilData) {
        const latestPrice = oilData.slice(-1)[0].price
        setOilPrice(latestPrice)
      }
    }

    checkLocalStorageAndUpdate()

    const intervalId = setInterval(checkLocalStorageAndUpdate, 60000) // Call the function every 60 seconds
    return () => {
      clearInterval(intervalId) // Clear the interval when the component unmounts
    }
  }, [])

  const tierForPrice = oilPrice ? 5 - getTierFromPercent(oilPrice, 40, 80) : undefined

  useEffect(() => {
    if (tierForPrice < 2) {
      setClassName("latestOilPriceShortCut clickable glow")
    } else {
      setClassName("latestOilPriceShortCut clickable")
    }
  }, [tierForPrice])

  const oilPriceStyle = getStyleFromTier(tierForPrice)

  return (
    <span
      style={{ marginLeft: 10, position: "relative", display: "inline-block" }}
      className={className}
      title="Latest Oil Price">
      <span className="latest-price label" style={{ ...oilPriceStyle }}>
        {oilPrice ? `$${new Intl.NumberFormat("en-US").format(oilPrice)}` : "Loading..."}
      </span>
    </span>
  )
}

export default OilOverlay
