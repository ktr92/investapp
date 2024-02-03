import {createTable} from './table.template'

export class Table {
  constructor(public selector: string, public items: Array<IObjIndexable>) {}

  render() {
    const $root: Node = document.querySelector(this.selector)
    const root: HTMLElement = $root.appendChild(document.createElement('div'))
    const table = createTable(this.items)
    root.innerHTML = table
  }
}
