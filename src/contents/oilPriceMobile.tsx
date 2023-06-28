import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoRender } from "plasmo"
import { createRoot } from "react-dom/client"

import OilOverlay from "~/components/OilOverlay"

export const config: PlasmoCSConfig = {
  matches: ["https://*.airline-club.com/*"]
}

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkIntervalMobile = setInterval(() => {
      const mobileOnlyElement = document.querySelector(".mobileOnly")
      mobileOnlyElement?.removeAttribute("style")
      mobileOnlyElement?.setAttribute("style", "width: 40%")

      const mobileContainerParent = document.querySelector(
        "div.mobileOnly div.topBarDetails span.delegatesShortcut.clickable"
      )
      if (mobileContainerParent) {
        clearInterval(checkIntervalMobile)
        const mobileRootContainer = document.createElement("span")
        mobileRootContainer.setAttribute("onclick", "showOilCanvas()")
        mobileContainerParent.after(mobileRootContainer)
        resolve(mobileRootContainer)
      }
    }, 137)
  })

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<OilOverlay />)
}
