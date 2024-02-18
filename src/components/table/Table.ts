import {TableComponent} from './TableComponent'
import {ViewComponent} from './ViewComponent'
import {renderTable} from './table.template'
import {renderBody} from './table.template'

interface ITableComponent {
  components: Array<TableComponent>
  headers: Array<string>
  footers: Array<unknown>
}

interface IConstructor {
  new (...args: Array<unknown>): ITableComponent,
}

export class Table {
  constructor(public selector: string, protected Component: IConstructor, public items: Array<unknown>) {
    this.init()
  }

  protected instances: ITableComponent

  init() {
    this.instances = new this.Component(this.items)
  }

  render() {
    const $root: Node = document.querySelector(this.selector)
    const root: HTMLElement = $root.appendChild(document.createElement('div'))

    const table = renderTable(this.instances.components, this.instances.headers, this.instances.footers)
    root.innerHTML = table

    renderBody(this.instances.components)

    root.addEventListener('click', e => {
      if (e.target instanceof HTMLElement) {
        if (e.target.getAttribute('data-header')) {
          this.sortTable(Number(e.target.getAttribute('data-sort')))
        }
      }
    })
  }

  sortTable(index: number) {
    console.log('before: ', this.instances)

    this.instances.components.sort((a, b) => (a.props[index] as ViewComponent).sortField - (b.props[index] as ViewComponent).sortField)

    renderBody(this.instances.components)

    console.log(this.instances)
  }
}
