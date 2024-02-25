import {DomComponent} from '../DomComponent'
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

export class Table extends DomComponent {
  constructor(public selector: string, protected Component: IConstructor, public items: Array<unknown>) {
    super()
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
      this.sortTable(e)
    })
  }

  sortTable(e: Event) {
    if (e.target instanceof HTMLElement) {
      const direction = e.target.getAttribute('data-header')
      const classes = e.target.classList
      if (direction) {
        if (direction === 'asc') {
          this.sortAsc(Number(e.target.getAttribute('data-sort')))
          e.target.setAttribute('data-header', 'desc')
          classes.remove('asc')
          classes.remove('desc')
          classes.add('desc')
        }
        if (direction === 'desc') {
          this.sortDesc(Number(e.target.getAttribute('data-sort')))
          e.target.setAttribute('data-header', 'asc')
          classes.remove('asc')
          classes.remove('desc')
          classes.add('asc')
        }
        this.toggleClass(e.target, '.sorted', 'sorted')
        renderBody(this.instances.components)
      }
    }
  }

  sortAsc(index: number) {
    this.instances.components.sort((a, b) => (a.props[index] as ViewComponent).sortField - (b.props[index] as ViewComponent).sortField)
  }

  sortDesc(index: number) {
    this.instances.components.sort((a, b) => (b.props[index] as ViewComponent).sortField - (a.props[index] as ViewComponent).sortField)
  }
}
