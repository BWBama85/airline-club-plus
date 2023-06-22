import { fetchData } from "~helpers/apiService"

export async function loadAirplaneModelStats(modelInfo, opts?) {
  let cachedTotalsById = {}
  let favoriteIcon = document.querySelector("#airplaneModelDetail .favorite") as HTMLImageElement
  let model = window.loadedModelsById[modelInfo.id]
  let url: string

  if (window.activeAirline) {
    url = `airlines/${window.activeAirline.id}/airplanes/model/${model.id}/stats`
    favoriteIcon.style.display = "block"
  } else {
    url = `airplane-models/${model.id}/stats`
    favoriteIcon.style.display = "none"
  }

  if (opts.totalOnly && model.in_use && model.in_use !== -1) {
    // console.log("opts.totalOnly && model.in_use && model.in_use !== -1")
    return
  }

  if (opts.totalOnly && cachedTotalsById[model.id]) {
    model.in_use = cachedTotalsById[model.id]
    // console.log("opts.totalOnly && cachedTotalsById[model.id]")
    return
  }

  const stats = await fetchData(url)
  // console.log("Stats.Total: ", stats.total)
  if (opts.totalOnly) {
    cachedTotalsById[model.id] = model.in_use = stats.total
    // console.log("opts.totalOnly")
    return
  }

  window.updateTopOperatorsTable(stats)
  ;(document.querySelector("#airplaneCanvas .total") as HTMLElement).textContent = stats.total

  cachedTotalsById[model.id] = model.in_use = stats.total

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
