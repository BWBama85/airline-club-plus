export function getStyleFromTier(tier: number): string {
  const stylesFromGoodToBad: Array<string> = [
    "color:#29FF66;",
    "color:#5AB874;",
    "color:inherit;",
    "color:#FA8282;",
    "color:#FF6969;",
    "color:#FF3D3D;font-weight: bold;"
  ]
  return stylesFromGoodToBad[tier] || "color:inherit"
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
