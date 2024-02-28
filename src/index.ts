/* eslint-disable no-debugger */
/* import {Broker} from './components/Broker'
 */import {Portfolio} from './components/Portfolio'
import {Position} from './components/position/Position'
/* import {TablePosition} from './components/view/table/TablePosition'
 *//* import {Stock} from './components/Stock' */
import {Table} from './components/table/Table'
import {TablePosition} from './components/table/TablePosition'
/* import {TableStock} from './components/table/TableStock' */
import './scss/index.scss'
import store from './store'
import {moexTickerLast} from './utils/getStockPrice'

/* const port = store.getters.getPortfolio('SBER') */

/* console.log(port) */

const all = store.getters.getAllPortfolio();

(async function() {
  await store.actions.initMoex()

  const allPortfolio = all.map(item => {
    return new Portfolio(item.id, item.name, item.depo, Position.createPosition(item.positions), item.comm)
  })

  allPortfolio.forEach(item => {
    const table = new Table('.table', TablePosition, item.positions)
    table.render()
  })
})();

/* store.actions.initMoex().then(() => console.log(store.getters.getMoex()))
 */

/* const moex = moexTickerLast('')
moex.then((res) => {
  console.log(res)
})
 */
// сделать массив Портфолио
/* const allPortfolio = all.map(item => {
  return new Portfolio(item.id, item.name, item.depo, Position.createPosition(item.positions), item.comm)
}) */

/* const allPositions: Array<Position> = Position.createTotalPositions(all.positions) */

/* const positions1 = port.positions.map(item => {
  return new Position(item.ticker, item.buyPrice, item.count, item.myStop)
}) */
/* const allPortfolio = all.map(pp => {
  new Portfolio(pp.id, pp.name, pp.depo, pp.positions, pp.comm)
})

console.log(allPortfolio) */

/* const portfolio1 = new Portfolio(port.id, port.name, port.depo, positions1, port.comm) */

/* const position1 = new Position('LKOH', 6990, 22, 5000)
const position2 = new Position('SVCB', 6500, 15, 0) */

/* const portfolio1 = new Portfolio('ИИС')
portfolio1.buyStock(position1)
portfolio1.buyStock(position2) */

/* allPortfolio.forEach(item => {
  const table = new Table('.table', TablePosition, item.positions)
  table.render()
}) */
/* const tickerlist = []
allPortfolio.forEach(item => {
  tickerlist.push(item)
}) */

/* table.render() */
