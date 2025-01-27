import {DomComponent} from '../DomComponent'
import {Emitter} from '../Emitter'
import {TableComponent} from './TableComponent'
import {ViewComponent} from './ViewComponent'
import {renderTable} from './table.template'
import {renderBody} from './table.template'

interface ITableComponent {
  components: Array<TableComponent>
  headers: Array<string>
  footers: Array<unknown>
}
/**
 * Class representing table component
 */
export class Table extends DomComponent {
  /**
   * @constructor
   * @param {string} selector - element to insert rendered table
   * @param {IConstructor} Component - component using for generating specific table content
   * @param {Array} items - array of table rows (Positions)
   * @param {Element} emitter - the emitter
   * @param {name} tablename - title displaying before the table
   */
  constructor(public selector: string, protected Component: IConstructor<ITableComponent>, public items: Array<unknown>, public emitter: Emitter, public tablename: string) {
    super(selector)
    this.init()
  }

  protected instances: ITableComponent

  init() {
    this.instances = new this.Component(this.items)
  }

  render() {
    const $root: HTMLElement = document.querySelector(this.selector)
    $root.insertAdjacentHTML('afterend', '<div class="table"></div>')
    $root.classList.remove('table')
    $root.classList.add('renderedTable')
    const root: HTMLElement = $root.appendChild(document.createElement('div'))

    const table = renderTable(this.instances.headers, this.instances.footers, this.tablename)
    root.innerHTML = table

    renderBody($root, this.instances.components)

    root.addEventListener('click', e => {
      this.sortTable($root, e)
    })

    this.instances.components.forEach(component => {
      component.props.forEach(prop => {
        if (prop) {
          prop.initListeners(this.emitter)
        }
      })
    })
  }

  sortTable(root: HTMLElement, e: Event) {
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
        this.toggleClassEl(e.target, '.sorted', 'sorted')
        renderBody(root, this.instances.components)
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
