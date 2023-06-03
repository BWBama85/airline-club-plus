export function appendCell(
  row: HTMLDivElement,
  title: string,
  content: string | Document,
  isEllipsis: boolean = false,
  align: "left" | "right" = "left",
  style?: string
): void {
  const cell = document.createElement("div")
  cell.className = "cell"
  cell.title = title
  cell.style.textAlign = align

  if (style) {
    cell.style.cssText = style
  }

  if (isEllipsis) {
    cell.style.textOverflow = "ellipsis"
    cell.style.overflow = "hidden"
    cell.style.whiteSpace = "pre"
  }

  if (typeof content === "string") {
    cell.textContent = content
  } else if (content instanceof Document) {
    const rootElement = content.documentElement
    const importedRootElement = document.importNode(rootElement, true)
    cell.appendChild(importedRootElement)
  }

  row.appendChild(cell)
}

export function prependCell(
  row: HTMLDivElement,
  title: string,
  text: string,
  isEllipsis: boolean = false,
  align: "left" | "right" = "left",
  style?: string
): void {
  const cell = document.createElement("div")
  cell.className = "cell"
  cell.title = title
  cell.style.textAlign = align

  if (style) {
    cell.style.cssText = style
  }

  if (isEllipsis) {
    cell.style.textOverflow = "ellipsis"
    cell.style.overflow = "hidden"
    cell.style.whiteSpace = "pre"
  }

  cell.textContent = text
  row.insertBefore(cell, row.firstChild)
}
