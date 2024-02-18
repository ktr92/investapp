import {TableComponent} from './TableComponent'

import {Change} from '../position/Change'
import {Price} from '../position/Price'
import {Stock} from '../position/Stock'
import {Count} from '../position/Count'
import {Totalprice} from '../position/Totalprice'

declare interface IPosition extends IObjIndexable {
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
  constructor(private items: IPosition[]) {
    this.init()
  }
  public viewItems: TableComponent
  public headers = ['Актив', 'Средняя цена', 'Кол-во', 'Вложено', 'Текущая стоимость', 'Прибыль']
  public props = ['stock', 'startPrice', 'count', 'startTotal', 'currentPrice', 'change']
  public components: Array<TableComponent> = []

  init() {
    this.items.forEach(item => {
      const viewItem = new TableComponent()
      Object.keys(item)
          .forEach(key => {
            if (this.props.indexOf(key) > -1) {
              viewItem.props[key] = item[key]
            }
          })
      this.components.push(viewItem)
    })
  }
}
