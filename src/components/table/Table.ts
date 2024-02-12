import {TableComponent} from './TableComponent'
import {renderTable} from './table.template'

interface ITableComponent {
  components: Array<TableComponent>
}

interface IConstructor {
  new (...args: Array<unknown>): ITableComponent,
}

export class Table {
  constructor(public selector: string, protected Component: IConstructor, public items: Array<unknown>) {
    this.init()
  }

  protected instances: Array<Array<TableComponent>> = []

  init() {
    // для каждой позиции (items) нужно сформировать массив с компонентами таблицы
    this.items.forEach((item) => {
      const subinstance = new this.Component(item)
      this.instances.push(subinstance.components as Array<TableComponent>)
    })
  }

  render() {
    const $root: Node = document.querySelector(this.selector)
    const root: HTMLElement = $root.appendChild(document.createElement('div'))

    const table = renderTable(this.instances)
    root.innerHTML = table
  }
}
