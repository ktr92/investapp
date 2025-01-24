import {DomComponent} from '../DomComponent';
import {Table} from '../table/Table';
import Dropdown from '../UI/Dropdown';
import {AppComponent} from '../AppComponent';
import {Emitter} from '../Emitter';
import {Store} from '../../store';
import {TableHistory} from './TableHistory';
import {mapTableData} from '../../utils/maps';
import {Position} from '../position/Position';

/**
 * Class for connecting table template with data
 */
export class BlockTable extends AppComponent {
  constructor(selector: DomComponent, options: DomOptions) {
    super(selector, {
      listeners: [],
      ...options
    })
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

  toHTML(): string {
    return `
      <div class="table"></div>
    `
  }
  /**
   *
   * @param {Array} source - array of data
   * @param {string} action - some fn to prepare data for table rendering
   * @param {string} type - some constructor name {@link mapTableData} that can create an instance of table data
   */
  createTable(source: Array<TableData>, action = 'createPositions', type = 'TablePosition'): void {
    const tabledata = this.state.actions.getAction(action).call(this, source, this.state)

    tabledata.forEach((item: unknown[]) => {
      const table = new Table('.table', mapTableData()[type], item, this.emitter)
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
