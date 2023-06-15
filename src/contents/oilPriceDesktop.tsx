import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoRender } from "plasmo"
import { createRoot } from "react-dom/client"

import OilOverlay from "~/modules/OilOverlay"

export const config: PlasmoCSConfig = {
  matches: ["https://*.airline-club.com/*"]
}

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const desktopContainerParent = document.querySelector(
        "div.desktopOnly span.topBarDetails span.delegatesShortcut.clickable"
      )
      if (desktopContainerParent) {
        clearInterval(checkInterval)
        const desktopRootContainer = document.createElement("span")
        desktopRootContainer.setAttribute("onclick", "showOilCanvas()")
        desktopContainerParent.after(desktopRootContainer)
        resolve(desktopRootContainer)
      }
    }, 137)
  })

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<OilOverlay />)
}
