import type { PlasmoCSConfig } from "plasmo"

import { getStyleFromTier, getTierFromPercent } from "~helpers/tiers"

export const config: PlasmoCSConfig = {
  matches: ["https://*.airline-club.com/*"],
  run_at: "document_idle"
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
