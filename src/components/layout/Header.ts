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

export class Header extends AppComponent {
  constructor(selector: DomComponent, options: DomOptions) {
    super(selector, {
      listeners: [],
      ...options
    })
    this.emitter = options.emitter
    this.unsubs = []
    /*   this.$root.insertAdjacentHTML('beforeend', this.render()) */
  }

  public el: DomComponent
  public dropdownPortfolio: Dropdown
  static id = 'header'

  init(): void {
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

    document.querySelector('[data-click="changeTheme"]').addEventListener('click', e => {
      this.$emit('header:changeTheme')
    })

    this.$on('header:changeTheme', () => {
      this.changeTheme()
    })
  }

  toHTML(): string {
    return `
    <div class="headerwrapper">
    <div id="headerpanel" class='py-2 bg-slate-100 dark:bg-gray-600 mb-8'>
      <div class="flex items-center justify-between container">
        <div class='flex items-center'>
          <div class="block" id='ddHeaderLeft'>
            <button id="dropdownButton" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-40 justify-center" type="button"> <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
              </button>
              
              <!-- Dropdown menu -->
              <div id="dropdownMenu" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                 
              </div>
          </div><!-- /.block -->
          <div class="block ml-8  ">
            <button data-click="showAllBrokers" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">Total portfolio</button>
          </div><!-- /.block -->
        </div>
        <div class="cursor-pointer group" data-click='changeTheme' >
          <svg width="30px" height="30px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">  
            <g  stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g class='fill-gray-400 group-hover:fill-gray-900 dark:fill-slate-300 dark:group-hover:fill-slate-100' id="ic_fluent_dark_theme_24_regular" fill="#212121" fill-rule="nonzero">
                  <path d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20.5 L12,3.5 C16.6944204,3.5 20.5,7.30557963 20.5,12 C20.5,16.6944204 16.6944204,20.5 12,20.5 Z" id="">
                  </path>
                </g>
            </g>
          </svg>
        </div><!-- /.theme -->
      </div><!-- /.flex items-center -->
    </div><!-- /#headerpanel -->
    <div id="headercontent"></div><!-- /#headercontent -->
  </div>
    `
  }

  changeTheme() {
    const html = document.querySelector('html')
    if (html instanceof Element) {
      changeClass(html, 'dark')
    }
    this.$emit('header:theme')
  }

  showAllBrokers() {
    document.querySelectorAll('.renderedTable').forEach(item => {
      item.innerHTML = ''
    })

    const all = store.getters.getAllPortfolio();
    const allPortfolio = all.map(item => {
      return new Portfolio(item.id, item.name, item.depo, Position.createPosition(item.positions), item.comm)
    })
    /*
    allPortfolio.forEach(item => {
      const table = new Table('.table', TablePosition, item.positions, {})
      table.render()
    })
 */
    this.dropdownPortfolio.reset()

    this.$emit('header:allbrokers')
  }

  changeBroker(event: Event) {
    const id = +(event.target as HTMLElement).dataset['params']
    store.actions.changeBroker(id)

    const pfolio = new Portfolio(store.state.currentPortfolio.id, store.state.currentPortfolio.name, store.state.currentPortfolio.depo, Position.createPosition(store.state.currentPortfolio.positions), store.state.currentPortfolio.comm)

    document.querySelectorAll('.renderedTable').forEach(item => {
      item.innerHTML = ''
    })
    /*  const table = new Table('.table', TablePosition, pfolio.positions)
    table.render() */

    this.$emit('header:setbroker')
  }
}
