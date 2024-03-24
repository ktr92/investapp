import {DomComponent} from '../DomComponent';
import {Table} from '../table/Table';
import {TablePosition} from '../../components/table/TablePosition'

/* import store from './../../store' */
import {Position} from '../position/Position';
import {Portfolio} from '../Portfolio';
import Dropdown from '../UI/Dropdown';
import {AppComponent} from '../AppComponent';
import {Emitter} from '../Emitter';
import changeClass from '../../utils/toggleClass';
import {Store} from '../../store';

interface DomOptions {
  name: string,
  listeners: Array<string>,
  emitter: Emitter,
  unsubs: Array<CallbackFunction>,
  state: Store
}

export class BlockTable extends AppComponent {
  constructor(selector: DomComponent, options: DomOptions) {
    super(selector, {
      listeners: [],
      ...options
    })
    this.emitter = options.emitter
    this.state = options.state
    this.unsubs = []

    console.log(this.state.moex)
    /*   this.$root.insertAdjacentHTML('beforeend', this.render()) */
  }

  public state: Store
  public el: DomComponent
  public dropdownPortfolio: Dropdown
  static id = 'tableblock'

  init(): void {
    const all = this.state.getters.getAllPortfolio();
    this.createTable(all)
    console.log(all)
  }

  toHTML(): string {
    return `
      <div class="table"></div>
    `
  }

  createTable(source: Array<IPortfolio>) {
    const allPortfolio = source.map(item => {
      return new Portfolio(item.id, item.name, item.depo, Position.createPosition(item.positions, this.state), item.comm)
    })

    allPortfolio.forEach(item => {
      const table = new Table('.table', TablePosition, item.positions)
      table.render()
    })
  }
}
