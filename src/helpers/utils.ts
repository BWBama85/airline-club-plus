import { Constants } from "~/helpers/constants"

/**
 * Returns a style object based on a given tier number.
 *
 * @param {number} tier - The tier number.
 * @returns An object containing color and possibly fontWeight.
 */
export function getStyleFromTier(tier: number): { color: string; fontWeight?: string } {
  return Constants.STYLES_FROM_GOOD_TO_BAD[tier] || { color: "inherit" }
}

/**
 * Calculates a 'tier' for a given value as a proportion within a specified range.
 * The 'tier' is a value from 0 to 5, based on which segment of the range the value falls into.
 * The segments are determined by percentages of the total range: >95%, >80%, >75%, >60%, >50%, <=50%.
 *
 * @param {number} val - The value for which to calculate the tier.
 * @param {number} [min=0] - The minimum value of the range (default is 0).
 * @param {number} [max=100] - The maximum value of the range (default is 100).
 * @returns {number} The tier of the value, a number between 0 and 5.
 */
export function getTierFromPercent(val: number, min = 0, max = 100): number {
  const availableRange = max - min
  const ranges = [0.95, 0.8, 0.75, 0.6, 0.5].map((multiplier) => availableRange * multiplier + min)

  if (val > ranges[0]) {
    return 0
  } else if (val > ranges[1]) {
    return 1
  } else if (val > ranges[2]) {
    return 2
  } else if (val > ranges[3]) {
    return 3
  } else if (val > ranges[4]) {
    return 4
  }

  return 5
}

/**
 * Calculate the flight time for a plane given a distance.
 * @param {Plane} plane - The plane to calculate flight time for.
 * @param {number} distance - The distance to calculate flight time for.
 * @returns {number} The flight time in minutes.
 */
export function calcFlightTime(plane: Plane, distance: number): number {
  let speedFactor = plane.airplaneType.toUpperCase() === "SUPERSONIC" ? Constants.SUPERSONIC_SPEED_FACTOR : 1
  let speed = plane.speed * speedFactor

  // Calculate flight time for different segments of flight with different speeds
  let flightDistances = Constants.SPEED_FACTORS.map((maxSpeed) => {
    let distSegment = Math.min(distance, maxSpeed)
    distance = Math.max(0, distance - distSegment)
    return distSegment / Math.min(speed, maxSpeed)
  })

  // Add remaining distance if any
  flightDistances.push(Math.max(0, distance) / speed)

  let totalFlightTime = flightDistances.reduce((a, b) => a + b)

  return totalFlightTime * 60 // Return in minutes
}

/**
 * Calculate the fuel burn for a plane given a distance.
 * @param {Plane} plane - The plane to calculate fuel burn for.
 * @param {number} distance - The distance to calculate fuel burn for.
 * @returns {number} The fuel burn.
 */
export function calcFuelBurn(plane: Plane, distance: number): number {
  let timeFlight = calcFlightTime(plane, distance) / 60 // Convert it back to hours
  let fuelBurn = plane.fuelBurn

  const LONG_FLIGHT_TIME = 1.5 // Time in hours indicating a long flight
  const FUEL_BURN_RATE_SHORT = 5.5 // Rate of fuel burn for short flights

  if (timeFlight > LONG_FLIGHT_TIME) {
    return fuelBurn * (405 + timeFlight)
  } else {
    return fuelBurn * timeFlight * FUEL_BURN_RATE_SHORT
  }
}

/**
 *
 * @returns A div element with a loading message.
 */
export function createLoadingElement(): HTMLDivElement {
  const loadingElement = document.createElement("div")
  loadingElement.id = "loading-element"
  loadingElement.style.margin = "0 auto"
  loadingElement.style.textAlign = "center"
  loadingElement.textContent =
    "Please wait, loading all the airplane models. This takes a few seconds on the first load."
  return loadingElement
}

export function formatCurrency(num: number): string {
  let formatUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  })
  return `${formatUSD.format(num).replace(".00", "")}`
}

// Function to create a comparison function for sorting
// --
// Creates a comparison function for sorting objects based on a given property.
// The comparison function can be used directly in Array.prototype.sort().
// If the values of the property in the objects are arrays, it sorts based on their lengths.
// If the `ascending` parameter is false, it sorts in descending order, otherwise it sorts in ascending order.

// @param {string} property - The name of the property to sort the objects by.
// @param {boolean} [ascending=true] - Indicates whether the sort order should be ascending (default) or descending.
// @returns {(a: SortableObject, b: SortableObject) => number} - A comparison function that can be used in Array.prototype.sort().

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
