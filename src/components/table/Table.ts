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

  /*   protected instances: Array<Array<TableComponent>> = []
 */

  protected instances: ITableComponent

  init() {
    this.instances = new this.Component(this.items)

    /*  this.items.forEach((item) => {
      const subinstance = new this.Component(item)
      this.instances.push(subinstance.components as Array<TableComponent>)
    })

    this.items.forEach((item) => {
      console.log(item)
    }) */
  }

  render() {
    const $root: Node = document.querySelector(this.selector)
    const root: HTMLElement = $root.appendChild(document.createElement('div'))

    console.log(this.instances)

    const table = renderTable(this.instances.components)
    root.innerHTML = table
  }
}
