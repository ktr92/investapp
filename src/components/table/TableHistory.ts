import {DomComponent} from '../DomComponent';
import {Table} from './Table';

export class TableHistory extends DomComponent {
  constructor(public selector: string) {
    super(selector)
  }

  createTable() {
    /* const table = new Table('.table', TablePosition, positions, this.emitter)
    table.render() */
  }

  render() {
    const $root: HTMLElement = document.querySelector(this.selector)
    $root.insertAdjacentHTML('beforeend', '<div class="history"></div>')
  }
}
