import {TableComponent} from './TableComponent'
import {renderTable} from './table.template'

interface IConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any): TableComponent,
}

export class Table {
  constructor(
    public selector: string,
    public Component: IConstructor,
    public items: Array<IObjIndexable>) {}

  public tableELement: Array<TableComponent> = []

  init() {
    this.items.forEach((item: unknown) => {
      const tablecomponent = new this.Component(item)
      this.tableELement.push(tablecomponent)
    })

    console.log(this.tableELement)
  }

  render() {
    const $root: Node = document.querySelector(this.selector)
    const root: HTMLElement = $root.appendChild(document.createElement('div'))

    const table = renderTable(this.tableELement)
    root.innerHTML = table
  }
}
