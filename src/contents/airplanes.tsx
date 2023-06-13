import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoCSUIProps, PlasmoRender } from "plasmo"
import type { FC } from "react"
import { createRoot } from "react-dom/client"

export const config: PlasmoCSConfig = {
  matches: ["https://www.plasmo.com/*"]
}

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.querySelector(
        "div.mainPanel.airplaneCanvasLeftGroup div.section div.table div.table-header"
      )
      if (rootContainerParent) {
        clearInterval(checkInterval)
        const rootContainer = document.createElement("div")
        // rootContainer.className = "table-header"
        rootContainerParent.after(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })

const PlasmoOverlay: FC<PlasmoCSUIProps> = () => {
  return (
    <div style={{ marginTop: 5 }}>
      <div style={{ padding: 5 }}>
        <label style={{ padding: 5 }} htmlFor="distance">
          Distance
        </label>
        <input className="planLinkPrice" type="text" id="distance" value="1000" />
      </div>
      <div style={{ padding: 5 }}>
        <label style={{ padding: 5 }} htmlFor="runwayLength">
          Run. Len.
        </label>
        <input className="planLinkPrice" type="text" id="runwayLength" value="3600" />
      </div>
      <div style={{ padding: 5 }}>
        <label style={{ padding: 5 }} htmlFor="minCapacity">
          Min Cap.
        </label>
        <input className="planLinkPrice" type="text" id="minCapacity" value="0" />
      </div>
      <div style={{ padding: 5 }}>
        <label style={{ padding: 5 }} htmlFor="minCirculation">
          Min Cir.
        </label>
        <input className="planLinkPrice" type="text" id="minCirculation" value="0" />
      </div>
    </div>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<PlasmoOverlay />)
}

export default PlasmoOverlay
