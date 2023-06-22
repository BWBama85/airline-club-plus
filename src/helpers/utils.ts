export function getStyleFromTier(tier: number): { color: string; fontWeight?: string } {
  const stylesFromGoodToBad: Array<{ color: string; fontWeight?: string }> = [
    { color: "#29FF66" },
    { color: "#5AB874" },
    { color: "inherit" },
    { color: "#FA8282" },
    { color: "#FF6969" },
    { color: "#FF3D3D", fontWeight: "bold" }
  ]
  return stylesFromGoodToBad[tier] || { color: "inherit" }
}

export function getTierFromPercent(val: number, min = 0, max = 100): number {
  const availableRange = max - min
  const ranges = [0.95, 0.8, 0.75, 0.6, 0.5].map((multiplier) => availableRange * multiplier + min)

  for (let i = 0; i < ranges.length; i++) {
    if (val > ranges[i]) {
      return i
    }
  }

  return 5
}

export function sortByProperty(
  property: string,
  ascending: boolean = true
): (a: SortableObject, b: SortableObject) => number {
  const sortOrder = ascending ? 1 : -1

  return function (a: SortableObject, b: SortableObject): number {
    let aVal = a[property]
    let bVal = b[property]
    if (Array.isArray(aVal) && Array.isArray(bVal)) {
      aVal = aVal.length
      bVal = bVal.length
    }
    const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return result * sortOrder
  }
}

export function calcFlightTime(plane: IPlane, distance: number): number {
  const SUPERSONIC = "SUPERSONIC"
  const SPEED_FACTORS = [350, 500, 700]
  let speedFactor = plane.airplaneType.toUpperCase() === SUPERSONIC ? 1.5 : 1
  let speed = plane.speed * speedFactor

  let flightDistances = [300, 400, 400].map((dist, index) => {
    let distA = Math.min(distance, dist)
    distance = Math.max(0, distance - distA)
    return distA / Math.min(speed, SPEED_FACTORS[index])
  })

  flightDistances.push(Math.max(0, distance) / speed)
  let timeFlight = flightDistances.reduce((a, b) => a + b)

  return timeFlight * 60
}

export function calcFuelBurn(plane: IPlane, distance: number): number {
  let timeFlight = calcFlightTime(plane, distance) / 60 // convert it back to hours
  let fuelBurn = plane.fuelBurn

  if (timeFlight > 1.5) {
    return fuelBurn * (405 + timeFlight)
  } else {
    return fuelBurn * timeFlight * 5.5
  }
}
