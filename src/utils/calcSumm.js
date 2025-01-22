import numberWithSpaces from './formatNumber'

export default function calcSumm(source, ...keys) {
  let totalCount = 0
  source.forEach(item => {
    totalCount += keys.reduce((prev, current) => {
      return prev[current]
    }, item)
  })

  return numberWithSpaces(totalCount)
}
