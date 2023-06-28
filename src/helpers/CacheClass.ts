/**
 * `CacheClass` is a simple in-memory cache system.
 * This class stores key-value pairs where keys are strings and values are numbers.
 * It provides methods to set, get, and check existence of a key-value pair in the cache.
 */
export class CacheClass {
  private cache: { [key: string]: number } = {}

  /**
   * Stores a number value in the cache associated with a specified string key.
   *
   * @param {string} key - The key under which to store the value.
   * @param {number} value - The value to be stored.
   */
  set(key: string, value: number): void {
    this.cache[key] = value
  }

  /**
   * Retrieves a number value from the cache associated with a specified string key.
   *
   * @param {string} key - The key for which to retrieve the value.
   * @returns {number} The value associated with the key, or undefined if the key does not exist.
   */
  get(key: string): number {
    return this.cache[key]
  }

  /**
   * Checks whether a specific key exists in the cache.
   *
   * @param {string} key - The key to check for existence.
   * @returns {boolean} Returns true if the key exists, false otherwise.
   */
  has(key: string): boolean {
    return this.cache.hasOwnProperty(key)
  }
}
