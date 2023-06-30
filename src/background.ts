// Import Storage from plasmohq's storage module
import { Storage } from "@plasmohq/storage"

// Import fetchData function from local helper module
import { fetchData } from "~/helpers/apiService"

// Define the structure of the Config object
interface Config {
  apiUrl: string  // URL of the API to fetch data from
  intervalInMinutes: number  // Time interval between each fetch operation
  numCyclesToTrack: number  // Number of data points to track
  priceThreshold: number  // Price below which a notification should be sent
}

// Config object that holds application settings
const config: Config = {
  apiUrl: "https://www.airline-club.com/oil-prices",
  intervalInMinutes: 5,
  numCyclesToTrack: 10,
  priceThreshold: 60
}

// Create a new Storage object
const storage = new Storage()

// Create a new alarm that triggers every 'intervalInMinutes'
chrome.alarms.create("checkOilPrice", {
  periodInMinutes: config.intervalInMinutes
})

// Add a listener that initializes data when the extension is installed
chrome.runtime.onInstalled.addListener(() => initializeData())

// Add a listener that updates oil data when the alarm is triggered
chrome.alarms.onAlarm.addListener((alarm: chrome.alarms.Alarm) => {
  if (alarm.name === "checkOilPrice") {
    updateOilData()
  }
})

// Function to initialize oil data from a fetched source
async function initializeData(): Promise<void> {
  // Fetch latest oil data
  const oilData: OilData[] = await fetchLatestOilData()
  // Store the fetched data
  await storage.set("oilData", oilData)
}

// Function to fetch latest oil data from a specified API URL
async function fetchLatestOilData(): Promise<OilData[]> {
  // Fetch data from the API
  const fetchedData = await fetchData(config.apiUrl)
  // Return only the specified number of latest data entries
  return fetchedData.slice(-config.numCyclesToTrack)
}

// Function to update the stored oil data by fetching the latest data and updating the storage
async function updateOilData(): Promise<void> {
  // Retrieve stored oil data
  let oilData: OilData[] = (await storage.get("oilData")) || []
  // Fetch latest data from API
  const fetchedData = await fetchData(config.apiUrl)
  // Extract the latest entry
  const latestEntry: OilData = fetchedData[fetchedData.length - 1]
  // Check if the latest entry is already in the storage
  const isPresentInStorage = oilData.some((data: OilData) => data.cycle === latestEntry.cycle)
  // If the latest entry is not in the storage
  if (!isPresentInStorage) {
    // Add the latest entry to the oil data
    oilData.push(latestEntry)
    // If oil data has more entries than specified to track, remove the oldest one
    if (oilData.length > config.numCyclesToTrack) {
      oilData.shift()
    }
    // Update the storage with the updated oil data
    await storage.set("oilData", oilData)
    // If the price condition is met, send a notification
    if (shouldNotify(oilData)) {
      sendNotification()
    }
  }
}

// Function to check whether the oil price has dropped below a certain threshold
function shouldNotify(oilData: OilData[]): boolean {
  return oilData[oilData.length - 1].price < config.priceThreshold
}

// Function to send a notification
function sendNotification(): void {
  chrome.notifications.create({
    type: "basic",  // Basic type of notification
    iconUrl: "icons/icon_16.png",  // Icon for the notification
    title: "Oil Price Alert",  // Title for the notification
    message: `The price of oil has dropped below $${config.priceThreshold}.`  // Message for the notification
  })
}
