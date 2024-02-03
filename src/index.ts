/* import {Broker} from './components/Broker'
 */import {Portfolio} from './components/Portfolio'
import {Stock} from './components/Stock'
import {Table} from './components/table/Table'
import './scss/index.scss'

const stock1 = new Stock('Лукойл', 'LKOH', 6990, 6800)
const portfolio1 = new Portfolio('ИИС')
portfolio1.buyStock(stock1)
/* const broker1 = new Broker('Sber', 0.06, portfolio1); */

const table = new Table('#app', portfolio1.stocks)
table.render()
