import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://*.airline-club.com/*"],
  run_at: "document_idle"
}

declare global {
  interface Window {
    showOilCanvas: () => void
  }
}

const stylesFromGoodToBad = [
  "color:#29FF66;",
  "color:#5AB874;",
  "color:inherit;",
  "color:#FA8282;",
  "color:#FF6969;",
  "color:#FF3D3D;font-weight: bold;"
]

function getStyleFromTier(tier: number) {
  return stylesFromGoodToBad[tier]
}

function getTierFromPercent(val: number, min = 0, max = 100) {
  const availableRange = max - min
  const ranges = [0.95, 0.8, 0.75, 0.6, 0.5].map((multiplier) => availableRange * multiplier + min)

  if (val > ranges[0]) return 0
  if (val > ranges[1]) return 1
  if (val > ranges[2]) return 2
  if (val > ranges[3]) return 3
  if (val > ranges[4]) return 4

  return 5
}

function _updateLatestOilPriceInHeader(latestPrice: number) {
  const shortcutElement = document.querySelector(".topBarDetails .latestOilPriceShortCut")
  const delegatesShortcutElement = document.querySelector(".topBarDetails .delegatesShortcut")

  if (!shortcutElement) {
    const shortcutSpan = document.createElement("span")
    shortcutSpan.style.margin = "0px 10px"
    shortcutSpan.style.padding = "0 5px"
    shortcutSpan.title = "Latest Oil Price"
    shortcutSpan.className = "latestOilPriceShortCut clickable"

    shortcutSpan.setAttribute("onclick", "showOilCanvas()")

    const latestPriceSpan = document.createElement("span")
    latestPriceSpan.className = "latest-price label"
    shortcutSpan.appendChild(latestPriceSpan)

    delegatesShortcutElement.after(shortcutSpan)
  }

  const tierForPrice = 5 - getTierFromPercent(latestPrice, 40, 80)
  const latestOilPriceShortCut = document.querySelector(".latestOilPriceShortCut")

  if (tierForPrice < 2) {
    latestOilPriceShortCut.classList.add("glow", "button")
  } else {
    latestOilPriceShortCut.classList.remove("glow", "button")
  }

  const latestPriceElement = document.querySelector(".topBarDetails .latest-price")
  if (latestPriceElement instanceof HTMLElement) {
    latestPriceElement.textContent = "$" + new Intl.NumberFormat("en-US").format(latestPrice)
    latestPriceElement.style.cssText = getStyleFromTier(tierForPrice)
  }
}

async function checkLocalStorageAndUpdate() {
  chrome.storage.local.get("oilData", (data) => {
    if (data.oilData) {
      const latestPrice = data.oilData.slice(-1)[0].price
      _updateLatestOilPriceInHeader(latestPrice)
    }
  })
}

window.addEventListener("load", () => {
  checkLocalStorageAndUpdate()
  setInterval(checkLocalStorageAndUpdate, 60000)
})
