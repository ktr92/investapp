import {TableComponent} from './TableComponent'
import {Change} from '../position/Change'
import {Price} from '../position/Price'
import {Stock} from '../position/Stock'
import {Count} from '../position/Count'
import {Totalprice} from '../position/Totalprice'
import {ViewComponent} from './ViewComponent'
import numberWithSpaces from '../../utils/formatNumber'
import calcSumm from '../../utils/calcSumm'
import {Store} from '../../store/moex'

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
/**
 * component is used to connect data with table view
 */
export class TablePosition {
  constructor(items: IPosition[]) {
    this.init(items)
  }
  public viewItems: TableComponent
  public headers: string[] = Store.getStatic.getTableData().apply(null).columns.map((item: ITableColumn) => item.title)
  public props: string[] = Store.getStatic.getTableData().apply(null).columns.map((item: ITableColumn) => item.cell)

  public footers: Array<string> = []
  public components: Array<TableComponent> = []

  init(items: IPosition[]) {
    items.forEach(item => {
      if (item) {
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
      }
    })

    this.initFooters(items)
  }

  initSortfield(item: ViewComponent, newItem: ViewComponent, idx: number) {
    newItem.sort = idx
    newItem.sortField =item.value
  }

  initFooters(items: IPosition[]) {
    this.footers = Store.getStatic.getTableData().apply(null).columns.map((item: ITableColumn) => item.footer)
    /* this.footers.push('Всего')
    this.footers.push(calcSumm(items, 'count', 'value') + ' шт.')
    this.footers.push('')
    this.footers.push('')
    this.footers.push('')
    this.footers.push(this.calcBuy(items) + ' ₽')
    this.footers.push(calcSumm(items, 'currentPrice', 'value') + ' ₽')
    this.footers.push(this.calcChange(items)) */
  }

  calcBuy(items: IPosition[]) {
    let total = 0
    items.forEach(item => {
      total += item.startPrice.value * item.count.value
    })
    return numberWithSpaces(total.toFixed(2))
  }
  calcChange(items: IPosition[]) {
    let change = 0
    let percent = 0
    let total = 0

    items.forEach(item => {
      change += item.change.currentValue * item.count.value - item.change.startValue * item.count.value
      total += item.change.startValue * item.count.value
    })
    percent = change / total * 100

    return `<span class="${change > 0 ? 'text-green-500' : 'text-red-500'}">
      ${numberWithSpaces(change.toFixed(2))} ₽
      (${numberWithSpaces(percent.toFixed(2))} %)
    </span>`
  }
}
