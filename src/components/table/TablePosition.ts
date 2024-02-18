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
  public footers: Array<string> = []
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

    this.initFooters(items)
  }

  initFooters(items: IPosition[]) {
    this.footers.push('Всего')
    this.footers.push(this.calcCount(items))
    this.footers.push('')
    this.footers.push(this.calcBuy(items))
    this.footers.push(this.calcCurrent(items))
    this.footers.push(this.calcChange(items))
  }

  showText(str: string) {
    return str
  }

  calcCount(items: IPosition[]) {
    let totalCount = 0
    items.forEach(item => {
      totalCount += item.count.count
    })
    return totalCount.toString()
  }
  calcBuy(items: IPosition[]) {
    let total = 0
    items.forEach(item => {
      total += item.startPrice.value * item.count.count
    })
    return total.toString()
  }
  calcCurrent(items: IPosition[]) {
    let total = 0
    items.forEach(item => {
      total += item.currentPrice.total
    })
    return total.toString()
  }
  calcChange(items: IPosition[]) {
    let change = 0
    let percent = 0

    console.log(items)

    items.forEach(item => {
      change += item.change.currentValue * item.count.count - item.change.startValue * item.count.count
      percent = change / Number(item.startTotal.total) * 100
    })
    return change.toString() + ' (' + percent.toFixed(2).toString() + '%)'
  }
}
