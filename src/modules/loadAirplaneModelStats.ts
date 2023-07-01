// Import necessary classes and modules
import { CacheClass } from "~helpers/CacheClass"
import { fetchData } from "~helpers/apiService"

// Function to load airplane model stats, with option to load total stats only
export async function loadAirplaneModelStats(modelInfo: Plane, opts: Opts = { totalOnly: false }) {
  // Initialize a new cache to hold totals by model id
  const cachedTotalsById = new CacheClass()

  // Grab the "favorite" icon element
  let favoriteIcon = document.querySelector("#airplaneModelDetail .favorite") as HTMLImageElement
  
  // Get model from loaded models using the provided model id
  let model = window.loadedModelsById[modelInfo.id]
  let url: string

  // If only totals are needed and model is in use, return
  if (opts.totalOnly && model.in_use && model.in_use !== -1) {
    return
  }

  // If only totals are needed and model is already in cache, update the model and return
  if (opts.totalOnly && cachedTotalsById.has(model.id.toString())) {
    model.in_use = cachedTotalsById.get(model.id.toString())
    return
  }

  // Determine the URL based on whether an airline is active
  if (window.activeAirline) {
    url = `airlines/${window.activeAirline.id}/airplanes/model/${model.id}/stats`
    favoriteIcon.style.display = "block" // Display the favorite icon if an airline is active
  } else {
    url = `airplane-models/${model.id}/stats`
    favoriteIcon.style.display = "none" // Hide the favorite icon if no airline is active
  }

  // Fetch the stats from the API
  const stats: Stats = await fetchData(url)

  // If only totals are needed, cache the total and update the model, then return
  if (opts.totalOnly) {
    cachedTotalsById.set(model.id.toString(), stats.total)
    model.in_use = stats.total
    return
  }

  // Update the top operators table with the fetched stats
  window.updateTopOperatorsTable(stats)
  
  // Update the total display
  ;(document.querySelector("#airplaneCanvas .total") as HTMLElement).textContent = stats.total.toString()

  // Cache the total and update the model
  cachedTotalsById.set(model.id.toString(), stats.total)
  model.in_use = stats.total

  // If no favorite stats exist, return
  if (stats.favorite === undefined) {
    return
  }

  // Remove all event listeners from the favorite icon
  favoriteIcon.replaceWith(favoriteIcon.cloneNode(true))
  favoriteIcon = document.querySelector("#airplaneModelDetail .favorite") as HTMLImageElement

  // Get the "set favorite" modal element
  const setFavoriteModal = document.querySelector("#setFavoriteModal") as HTMLElement

  // If a rejection reason exists, add it to the modal dataset
  if (stats.favorite.rejection) {
    setFavoriteModal.dataset.rejection = stats.favorite.rejection
  } else {
    // Otherwise, delete any existing rejection from the modal dataset
    delete setFavoriteModal.dataset.rejection
  }

  // If the model is already a favorite, update the favorite icon and set a rejection reason
  if (modelInfo.isFavorite) {
    favoriteIcon.src = "assets/images/icons/heart.png"
    setFavoriteModal.dataset.rejection = "This is already the Favorite"
  } else {
    // Otherwise, show the icon as an empty heart
    favoriteIcon.src = "assets/images/icons/heart-empty.png"
  }

  // Store the model info in the modal dataset for later use
  setFavoriteModal.dataset.model = JSON.stringify(model)
}
