/* eslint-disable no-debugger */
/* import {Broker} from './components/Broker'
 */import {Portfolio} from './components/Portfolio'
import {Position} from './components/Position'
/* import {Stock} from './components/Stock' */
import {Table} from './components/table/Table'
/* import {TableStock} from './components/table/TableStock' */
import './scss/index.scss'

const position1 = new Position('Лукойл', 'LKOH', 6990, 5000)
const position2 = new Position('Совкомбанк', 'SVCB', 15.250, 0)

/* const stock1 = new Stock('LKOH', 'Лукойл', 7000, 110, 'https://storage.yandexcloud.net/snowball-data/asset-logos/SBER-MCX-RUB-custom.png')
const stock2 = new Stock('SVCB', 'Совкомбанк', 16, 0.7, '') */
/* const stocks: Array<Stock> = [stock1, stock2]
 */
const portfolio1 = new Portfolio('ИИС')
portfolio1.buyStock(position1)
portfolio1.buyStock(position2)
/* const broker1 = new Broker('Sber', 0.06, portfolio1); */

const table = new Table('#app', portfolio1.positions)
table.render()
