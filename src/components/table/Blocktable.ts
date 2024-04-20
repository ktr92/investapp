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
import {getPositionType} from '../../utils/getStockPrice';

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

    /*   this.$root.insertAdjacentHTML('beforeend', this.render()) */
  }

  public state: Store
  public el: DomComponent
  public dropdownPortfolio: Dropdown
  public emitter: Emitter
  static id = 'tableblock'

  init(): void {
    const all = this.state.getters.getAllPortfolio();
    this.createTable(all)

    this.$on('table:changeBroker', (id: string) => {
      this.changeBroker(id)
    })
    this.$on('table:showAllBrokers', () => {
      this.changeBroker()
    })
  }

  toHTML(): string {
    return `
      <div class="table"></div>
    `
  }

  createTable(source: Array<IPortfolio>) {
    source.forEach(portfolio => {
      let positions: Array<Position> = []
      this.state.marketList.forEach(item => {
        const positionType = getPositionType(item)
        if (portfolio.markets[item] && portfolio.markets[item].length) {
          const pp = new Portfolio(
              portfolio.id,
              portfolio.name,
              portfolio.depo,
              Position.createPosition(portfolio.markets[item], this.state, positionType, portfolio.comm, item),
              portfolio.comm
          )
          positions = positions.concat(pp.positions)
        }
      })

      const table = new Table('.table', TablePosition, positions, this.emitter)
      table.render()
    })
  }

  changeBroker(id?: string) {
    document.querySelectorAll('.renderedTable').forEach(item => {
      item.innerHTML = ''
    })

    if (id) {
      this.state.actions.changeBroker(String(id))

      this.createTable(this.state.currentPortfolio)
    } else {
      const all = this.state.getters.getAllPortfolio();
      this.createTable(all)
    }
  }
}
