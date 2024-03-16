import {DomComponent} from '../DomComponent';
import {Table} from '../table/Table';
import {TablePosition} from '../../components/table/TablePosition'

import store from './../../store'
import {Position} from '../position/Position';
import {Portfolio} from '../Portfolio';

export class Header extends DomComponent implements IObjIndexable {
  constructor(selector: string) {
    super(selector)
    this.initListeners('click')
  }

  changeTheme() {
    const html = this.$('html')
    if (html instanceof Element) {
      this.toggleClass(html, 'dark')
    }
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
