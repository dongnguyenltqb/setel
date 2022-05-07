export const sleep_ms = (ms: number) =>
  new Promise((solved) => setTimeout(solved, ms))
