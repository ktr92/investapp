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

const port = store.getters.getPortfolio('SBER')

/* console.log(port) */

const positions1 = port.positions.map(item => {
  return new Position(item.ticker, item.buyPrice, item.count, item.myStop)
})

const portfolio1 = new Portfolio(port.id, port.name, port.depo, positions1, port.comm)

/* const position1 = new Position('LKOH', 6990, 22, 5000)
const position2 = new Position('SVCB', 6500, 15, 0) */

/* const portfolio1 = new Portfolio('ИИС')
portfolio1.buyStock(position1)
portfolio1.buyStock(position2) */

const table = new Table('#app', TablePosition, portfolio1.positions)
table.render()
