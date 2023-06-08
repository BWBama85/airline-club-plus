import { fetchData } from "~/helpers/apiService"

export interface OilData {
  cycle: number
  price: number
}

interface Config {
  apiUrl: string
  intervalInMinutes: number
  numCyclesToTrack: number
  priceThreshold: number
}

const config: Config = {
  apiUrl: "https://www.airline-club.com/oil-prices",
  intervalInMinutes: 5,
  numCyclesToTrack: 10,
  priceThreshold: 60
}

let oilData: OilData[] = []

chrome.alarms.create("checkOilPrice", {
  periodInMinutes: config.intervalInMinutes
})

chrome.runtime.onInstalled.addListener(() => initializeData())

chrome.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm) => {
  if (alarm.name === "checkOilPrice") {
    updateOilData()
  }
})

async function initializeData(): Promise<void> {
  oilData = await fetchLatestOilData()
  saveToLocalStorage(oilData)
}

async function fetchLatestOilData(): Promise<OilData[]> {
  const fetchedData = await fetchData(config.apiUrl)
  return fetchedData.slice(-config.numCyclesToTrack)
}

function saveToLocalStorage(data: OilData[]): void {
  chrome.storage.local.set({ oilData: data }, function () {
    var error = chrome.runtime.lastError
    if (error) {
      console.error(error)
    }
  })
}

async function updateOilData(): Promise<void> {
  chrome.storage.local.get("oilData", async (data) => {
    if (data.oilData) {
      oilData = data.oilData
    }
    const fetchedData = await fetchData(config.apiUrl)
    const latestEntry: OilData = fetchedData[fetchedData.length - 1]
    const isPresentInStorage = oilData.some((data: OilData) => data.cycle === latestEntry.cycle)
    if (!isPresentInStorage) {
      oilData.push(latestEntry)
      if (oilData.length > config.numCyclesToTrack) {
        oilData.shift()
      }
      saveToLocalStorage(oilData)
      if (shouldNotify()) {
        sendNotification()
      }
    }
  })
}

function shouldNotify(): boolean {
  return oilData[oilData.length - 1].price < config.priceThreshold
}

function sendNotification(): void {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon_16.png",
    title: "Oil Price Alert",
    message: `The price of oil has dropped below $${config.priceThreshold}.`
  })
}
