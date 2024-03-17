import {DomComponent} from '../DomComponent';
import {Table} from '../table/Table';
import {TablePosition} from '../../components/table/TablePosition'

import store from './../../store'
import {Position} from '../position/Position';
import {Portfolio} from '../Portfolio';
import Dropdown from '../UI/Dropdown';

export class Header extends DomComponent implements IObjIndexable {
  constructor(selector: string) {
    super(selector)

    const all = store.getters.getAllPortfolio();
    const brokerLIst: Array<IListItem> = []

    all.forEach(broker => {
      brokerLIst.push({
        id: String(broker.id),
        text: broker.name,
        type: 'event'
      })
    })

    this.dropdownPortfolio = new Dropdown('#dropdownButton', 'Select Portfolio', '#dropdownMenu', [...brokerLIst])
    this.initListeners('click')
  }

  public dropdownPortfolio: Dropdown

  changeTheme() {
    const html = this.$('html')
    if (html instanceof Element) {
      this.toggleClass(html, 'dark')
    }
  }

  showAllBrokers() {
    document.querySelectorAll('.renderedTable').forEach(item => {
      item.innerHTML = ''
    })

    const all = store.getters.getAllPortfolio();
    const allPortfolio = all.map(item => {
      return new Portfolio(item.id, item.name, item.depo, Position.createPosition(item.positions), item.comm)
    })

    allPortfolio.forEach(item => {
      const table = new Table('.table', TablePosition, item.positions)
      table.render()
    })

    this.dropdownPortfolio.reset()
  }

  changeBroker(event: Event) {
    const id = +(event.target as HTMLElement).dataset['params']
    store.actions.changeBroker(id)

    const pfolio = new Portfolio(store.state.currentPortfolio.id, store.state.currentPortfolio.name, store.state.currentPortfolio.depo, Position.createPosition(store.state.currentPortfolio.positions), store.state.currentPortfolio.comm)

    document.querySelectorAll('.renderedTable').forEach(item => {
      item.innerHTML = ''
    })
    const table = new Table('.table', TablePosition, pfolio.positions)
    table.render()
  }
}
