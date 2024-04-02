import {TableComponent} from './TableComponent'

import {Change} from '../position/Change'
import {Price} from '../position/Price'
import {Stock} from '../position/Stock'
import {Count} from '../position/Count'
import {Totalprice} from '../position/Totalprice'
import {ViewComponent} from './ViewComponent'
import numberWithSpaces from '../../utils/formatNumber'

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
              this.initSortfield(item[key] as ViewComponent, newItem, idx)

              viewItem.props.push(newItem)
            }
          })
      this.components.push(viewItem)
    })

    this.initFooters(items)
  }

  initSortfield(item: ViewComponent, newItem: ViewComponent, idx: number) {
    newItem.sort = idx
    if (item instanceof Price) {
      newItem.sortField = (item as Price).value
    }
    if (item instanceof Totalprice) {
      newItem.sortField = (item as Totalprice).total
    }
    if (item instanceof Count) {
      newItem.sortField = (item as Count).count
    }
    if (item instanceof Count) {
      newItem.sortField = (item as Count).count
    }
    if (item instanceof Change) {
      newItem.sortField = (item as Change).value
    }
  }

  initFooters(items: IPosition[]) {
    this.footers.push('Всего')
    this.footers.push(this.calcCount(items) + ' шт.')
    this.footers.push('')
    this.footers.push(this.calcBuy(items) + ' ₽')
    this.footers.push(this.calcCurrent(items) + ' ₽')
    this.footers.push(this.calcChange(items))
  }

  calcCount(items: IPosition[]) {
    let totalCount = 0
    items.forEach(item => {
      totalCount += item.count.count
    })
    return numberWithSpaces(totalCount)
  }
  calcBuy(items: IPosition[]) {
    let total = 0
    items.forEach(item => {
      total += item.startPrice.value * item.count.count
    })
    return numberWithSpaces(total.toFixed(2))
  }
  calcCurrent(items: IPosition[]) {
    let total = 0
    items.forEach(item => {
      total += item.currentPrice.total
    })
    return numberWithSpaces(total.toFixed(2))
  }
  calcChange(items: IPosition[]) {
    let change = 0
    let percent = 0
    let total = 0

    items.forEach(item => {
      change += item.change.currentValue * item.count.count - item.change.startValue * item.count.count
      total += item.change.startValue * item.count.count
    })
    percent = change / total * 100

    return `<span class="${change > 0 ? 'text-green-500' : 'text-red-500'}">
      ${numberWithSpaces(change.toFixed(2))} ₽
      (${numberWithSpaces(percent.toFixed(2))} %)
    </span>`
  }
}
