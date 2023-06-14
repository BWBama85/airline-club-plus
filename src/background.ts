import { Storage } from "@plasmohq/storage"

import { fetchData } from "~/helpers/apiService"

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

const storage = new Storage()

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
  const oilData: OilData[] = await fetchLatestOilData()
  await storage.set("oilData", oilData)
}

async function fetchLatestOilData(): Promise<OilData[]> {
  const fetchedData = await fetchData(config.apiUrl)
  return fetchedData.slice(-config.numCyclesToTrack)
}

async function updateOilData(): Promise<void> {
  let oilData: OilData[] = (await storage.get("oilData")) || []
  const fetchedData = await fetchData(config.apiUrl)
  const latestEntry: OilData = fetchedData[fetchedData.length - 1]
  const isPresentInStorage = oilData.some((data: OilData) => data.cycle === latestEntry.cycle)
  if (!isPresentInStorage) {
    oilData.push(latestEntry)
    if (oilData.length > config.numCyclesToTrack) {
      oilData.shift()
    }
    await storage.set("oilData", oilData)
    if (shouldNotify(oilData)) {
      sendNotification()
    }
  }
}

function shouldNotify(oilData: OilData[]): boolean {
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
