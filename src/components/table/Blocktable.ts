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

    /*   this.$root.insertAdjacentHTML('beforeend', this.render()) */
  }

  public state: Store
  public el: DomComponent
  public dropdownPortfolio: Dropdown
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
        if (portfolio.markets[item] && portfolio.markets[item].length) {
          const pp = new Portfolio(portfolio.id, portfolio.name, portfolio.depo, Position.createPosition(portfolio.markets[item], this.state, item === 'TQBR' ? 'stock' : 'bonds', item), portfolio.comm)
          positions = positions.concat(pp.positions)
        }
      })

      /*   const allBonds = new Portfolio(portfolio.id, portfolio.name, portfolio.depo, Position.createPosition(portfolio.markets.TQCB, this.state, 'bonds'), portfolio.comm) */

      const table = new Table('.table', TablePosition, positions)
      table.render()

      /* if (positions.length) {
        positions.forEach(item => {
          if (item && item.positions && item.positions.length) {
            const table = new Table('.table', TablePosition, item.positions)
            table.render()
          }
        })
      } */
    })

    /* const allStocks = source.map(item => {
      return new Portfolio(item.id, item.name, item.depo, Position.createPosition(item.positions, this.state, 'stock'), item.comm)
    })

    const allBonds = source.map(item => {
      if (item.bonds && item.bonds.length > 0) {
        return new Portfolio(item.id, item.name, item.depo, Position.createPosition(item.bonds, this.state, 'bonds'), item.comm)
      }
    })

    allStocks.forEach(item => {
      const table = new Table('.table', TablePosition, item.positions)
      table.render()
    })

    if (allBonds && allBonds.length) {
      allBonds.forEach(item => {
        if (item) {
          const table = new Table('.table', TablePosition, item.positions)
          table.render()
        }
      })
    } */
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
