/**
 * localStorage 用来存放表头宽度信息
 */
export function saveHeaderWidth(
  routerPath: string,
  tableIndex: number,
  columnProperty: string,
  width: number
): void {
  const key = `${routerPath}-${tableIndex}`
  const table = JSON.parse(localStorage.getItem(key) || '{}')
  table[columnProperty] = width
  localStorage.setItem(key, JSON.stringify(table))
}

export function getHeaderWidth(
  routerPath: string,
  tableIndex: number
): Record<string, number> {
  return JSON.parse(localStorage.getItem(`${routerPath}-${tableIndex}`) || '{}')
}
