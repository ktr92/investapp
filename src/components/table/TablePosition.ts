import {TableComponent} from './TableComponent'

import {Change} from '../position/Change'
import {Price} from '../position/Price'
import {Stock} from '../position/Stock'
import {Count} from '../position/Count'
import {Totalprice} from '../position/Totalprice'
import {ViewComponent} from './ViewComponent'

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
  constructor(items: IPosition[]) {
    this.init(items)
  }
  public viewItems: TableComponent
  public headers = ['Актив', 'Кол-во', 'Средняя цена', 'Вложено', 'Текущая стоимость', 'Прибыль']
  public props = ['stock', 'count', 'startPrice', 'startTotal', 'currentPrice', 'change']
  public components: Array<TableComponent> = []

  init(items: IPosition[]) {
    items.forEach(item => {
      const viewItem = new TableComponent()
      Object.keys(item)
          .forEach(key => {
            const idx = this.props.indexOf(key)
            if (idx > -1) {
              const newItem = item[key] as ViewComponent
              newItem.sort = idx
              viewItem.props.push(newItem)
            }
          })
      this.components.push(viewItem)
    })
  }
}
