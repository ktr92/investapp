import {DomComponent} from '../DomComponent';
import {Table} from '../table/Table';
import {TablePosition} from '../../components/table/TablePosition'
import Dropdown from '../UI/Dropdown';
import {AppComponent} from '../AppComponent';
import {Emitter} from '../Emitter';
import {Store} from '../../store';
import {TableHistory} from './TableHistory';

interface DomOptions {
  name: string,
  listeners: Array<string>,
  emitter: Emitter,
  unsubs: Array<CallbackFunction>,
  state: Store
}

/**
 * Class for app table content
 */
export class BlockTable extends AppComponent {
  constructor(selector: DomComponent, options: DomOptions) {
    super(selector, {
      listeners: [],
      ...options
    })
    this.emitter = options.emitter
    this.state = options.state
    this.unsubs = []
  }

  public state: Store
  public el: DomComponent
  public dropdownPortfolio: Dropdown
  public emitter: Emitter
  static id = 'tableblock'

  init() {
    this.initStartstate()

    this.$on('table:changeBroker', (id: string) => {
      this.changeTableId(id)
    })
    this.$on('table:showAllBrokers', () => {
      this.changeTableId()
    })

    this.$on('table:changeView', (view: string) => {
      if (view === 'appHistory') {
        this.removeTables()
        const history = new TableHistory('#tableblock')
        history.render()
      }
    })
  }

  initStartstate() {
    const all = this.state.getters.getAllPortfolio();
    this.createTable(all)
  }

  createTable(source: Array<TableData>, type = 'positions') {
    /**
     * create position to render table
     */
    const tabledata = this.state.actions.createPositions(source, this.state)

    tabledata.forEach(item => {
      console.log(item)
      const table = new Table('.table', TablePosition, item, this.emitter)
      table.render()
    })
  }

  removeTables() {
    Store.portfolioName = null
    this.state.actions.changeBroker(null)
    document.querySelectorAll('.renderedTable').forEach(item => {
      item.remove()
    })
  }

  changeTableId(id?: string) {
    this.removeTables()

    if (id) {
      this.state.actions.changeBroker(String(id))
      this.createTable(this.state.currentPortfolio)
    } else {
      const all = this.state.getters.getAllPortfolio();
      this.createTable(all)
    }
  }
}
