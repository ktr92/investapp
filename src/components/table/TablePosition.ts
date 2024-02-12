import {TableComponent} from './TableComponent'
/* import {TableStock} from './TableStock'
import {Stock} from '../Stock' */

import {Change} from '../position/Change'
import {Price} from '../position/Price'
import {Stock} from '../position/Stock'
import {Count} from '../position/Count'
import {TableStock} from './TableStock'
import {TableCount} from './TableCount'
import {TablePrice} from './TablePrice'
import {TableTotal} from './TableTotal'
import {Totalprice} from '../position/Totalprice'
import {TableChange} from './TableChange'

declare interface IPosition {
  stock: Stock
  startPrice: Price
  count: Count
  startTotal: Totalprice
  currentPrice: Totalprice
  change: Change
  myStop: Price
  salePrice: Price
}

export class TablePosition {
  constructor(private items: IPosition) {
    this.init()
  }

  public components: Array<TableComponent> = []

  init() {
    this.components.push(new TableStock(this.items.stock, 0))
    this.components.push(new TablePrice(this.items.startPrice, 1))
    this.components.push(new TableCount(this.items.count, 2))
    this.components.push(new TableTotal(this.items.startTotal, 3))
    this.components.push(new TableTotal(this.items.currentPrice, 4))
    this.components.push(new TableChange(this.items.change, 5))
    this.components.push(new TablePrice(this.items.myStop, 6))
    this.components.push(new TablePrice(this.items.salePrice, 7))
  }
}
