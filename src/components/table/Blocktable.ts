import {DomComponent} from '../DomComponent';
import {Table} from '../table/Table';
import {TablePosition} from '../../components/table/TablePosition'

import store from './../../store'
import {Position} from '../position/Position';
import {Portfolio} from '../Portfolio';
import Dropdown from '../UI/Dropdown';
import {AppComponent} from '../AppComponent';
import {Emitter} from '../Emitter';
import changeClass from '../../utils/toggleClass';

interface DomOptions {
  name: string,
  listeners: Array<string>,
  emitter: Emitter,
  unsubs: Array<CallbackFunction>
}

export class BlockTable extends AppComponent {
  constructor(selector: DomComponent, options: DomOptions) {
    super(selector, {
      listeners: [],
      ...options
    })
    this.emitter = options.emitter
    this.unsubs = []

    console.log(this)
    /*   this.$root.insertAdjacentHTML('beforeend', this.render()) */
  }

  public el: DomComponent
  public dropdownPortfolio: Dropdown
  static id = 'tableblock'

  init(): void {
    const all = store.getters.getAllPortfolio();
    this.createTable(all)
  }

  toHTML(): string {
    return `
      <div class="table"></div>
    `
  }

  createTable(source: Array<IPortfolio>) {
    const allPortfolio = source.map(item => {
      return new Portfolio(item.id, item.name, item.depo, Position.createPosition(item.positions), item.comm)
    })

    allPortfolio.forEach(item => {
      const table = new Table('.table', TablePosition, item.positions)
      table.render()
    })
  }
}
