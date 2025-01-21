import numberWithSpaces from './formatNumber'

export default function calcSumm(source, ...keys) {
  let totalCount = 0
  source.forEach(item => {
    /* totalCount += item[fields[0]][fields[1]] */
    totalCount += keys.reduce((prev, current) => {
      console.log(item[current])
      return prev[current]
    }, item)
  })

  return numberWithSpaces(totalCount)
}
