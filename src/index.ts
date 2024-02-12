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

const position1 = new Position('LKOH', 6990, 10, 5000)
const position2 = new Position('SVCB', 15.250, 3000, 0)

const portfolio1 = new Portfolio('ИИС')
portfolio1.buyStock(position1)
portfolio1.buyStock(position2)

const table = new Table('#app', TablePosition, portfolio1.positions)
table.render()
