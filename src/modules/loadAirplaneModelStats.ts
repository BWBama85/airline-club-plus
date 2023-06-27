import { fetchData } from "~helpers/apiService"

class Cache {
  private cache: { [key: string]: number } = {}

  set(key: string, value: number): void {
    this.cache[key] = value
  }

  get(key: string): number {
    return this.cache[key]
  }

  has(key: string): boolean {
    return this.cache.hasOwnProperty(key)
  }
}

const cachedTotalsById = new Cache()

export async function loadAirplaneModelStats(modelInfo: Plane, opts: Opts = { totalOnly: false }) {
  let favoriteIcon = document.querySelector("#airplaneModelDetail .favorite") as HTMLImageElement
  let model = window.loadedModelsById[modelInfo.id]
  let url: string

  if (opts.totalOnly && model.in_use && model.in_use !== -1) {
    console.log("opts.totalOnly && model.in_use && model.in_use !== -1")
    return
  }

  if (opts.totalOnly && cachedTotalsById.has(model.id.toString())) {
    model.in_use = cachedTotalsById.get(model.id.toString())
    console.log("opts.totalOnly && cachedTotalsById[model.id]")
    return
  }

  if (window.activeAirline) {
    url = `airlines/${window.activeAirline.id}/airplanes/model/${model.id}/stats`
    favoriteIcon.style.display = "block"
  } else {
    url = `airplane-models/${model.id}/stats`
    favoriteIcon.style.display = "none"
  }

  const stats: Stats = await fetchData(url)

  if (opts.totalOnly) {
    cachedTotalsById.set(model.id.toString(), stats.total)
    model.in_use = stats.total
    console.log("opts.totalOnly")
    return
  }

  window.updateTopOperatorsTable(stats)
  ;(document.querySelector("#airplaneCanvas .total") as HTMLElement).textContent = stats.total.toString()

  cachedTotalsById.set(model.id.toString(), stats.total)
  model.in_use = stats.total

  if (stats.favorite === undefined) {
    return
  }

  // remove all listeners
  favoriteIcon.replaceWith(favoriteIcon.cloneNode(true))
  favoriteIcon = document.querySelector("#airplaneModelDetail .favorite") as HTMLImageElement

  const setFavoriteModal = document.querySelector("#setFavoriteModal") as HTMLElement

  if (stats.favorite.rejection) {
    setFavoriteModal.dataset.rejection = stats.favorite.rejection
  } else {
    delete setFavoriteModal.dataset.rejection
  }

  if (modelInfo.isFavorite) {
    favoriteIcon.src = "assets/images/icons/heart.png"
    setFavoriteModal.dataset.rejection = "This is already the Favorite"
  } else {
    favoriteIcon.src = "assets/images/icons/heart-empty.png"
  }

  setFavoriteModal.dataset.model = JSON.stringify(model)
}
