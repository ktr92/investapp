import {DomComponent} from '../DomComponent';
import {Table} from '../table/Table';
import {TablePosition} from '../../components/table/TablePosition'

import {Position} from '../position/Position';
import {Portfolio} from '../Portfolio';
import Dropdown from '../UI/Dropdown';
import {AppComponent} from '../AppComponent';
import {Emitter} from '../Emitter';
import changeClass from '../../utils/toggleClass';
import {Store} from '../../store';
import {CreateForm} from '../form/CreateForm';
import {getBrokerList} from '../AppUtils';

export class Header extends AppComponent {
  constructor(selector: DomComponent, options: DomOptions) {
    super(selector, {
      listeners: [],
      ...options
    })
    this.state = options.state
    this.emitter = options.emitter
    this.unsubs = []
    /*   this.$root.insertAdjacentHTML('beforeend', this.render()) */
  }
  public state: Store
  public el: DomComponent
  public dropdownPortfolio: Dropdown
  static id = 'header'

  init(): void {
    const brokerLIst = getBrokerList(this.state)

    this.dropdownPortfolio = new Dropdown('#dropdownButton', 'Портфель', '#dropdownMenu', [...brokerLIst], this.changeBroker.bind(this))

    document.querySelector('[data-click="changeTheme"]').addEventListener('click', e => {
      this.$emit('header:changeTheme')
    })
    document.querySelector('[data-click="showAllBrokers"]').addEventListener('click', e => {
      this.$emit('table:showAllBrokers')
    })
    document.querySelector('[data-click="showHistory"]').addEventListener('click', e => {
      this.$emit('table:changeView', 'appHistory')
    })
    document.querySelector('[data-modal="newPosition"]').addEventListener('click', async (e) => {
      const create = await CreateForm.create('#modalContent', this.state, this.addPosition.bind(this))
      this.$emit('modal:renderModal', {
        title: 'Add new position',
        content: create.$el.innerHTML
      })
      await create.initForm()
    })

    /* document.querySelector('[data-modal="sellPosition"]').addEventListener('click', e => {
      this.$emit('modal:renderModal', {
        title: 'Sell position',
        content: 'FORM'
      })
    }) */

    this.$on('header:changeTheme', () => {
      this.changeTheme()
    })
    this.$on('header:moexUpdate', async (id?: string) => {
    /*   this.state.moex = await this.state.actions.initMoex() */
      this.state.moex = await this.state.actions.initMoex()
      this.$emit('table:changeBroker', id)
      this.dropdownPortfolio.setValue(this.state.getters.getPortfolioById(id).name)
      /*  if (this.state.getters.getCurrent().length && this.state.getters.getCurrent()[0].id !== id) {
        this.$emit('table:changeBroker', id)
      } */
    })
  }

  addPosition(brokerId: string, position: IPosition, isclone: boolean, market: string) {
    this.state.actions.addPosition(brokerId, position, isclone, market)
    this.$emit('header:moexUpdate', brokerId)
    this.$emit('modal:closeModal')
  }

  toHTML(): string {
    return `
    <div class="headerwrapper h-full w-64">
    <div id="headerpanel" class='py-2 bg-slate-100 dark:bg-slate-600 mb-2 h-full'>
      <div class="flex flex-col justify-between px-8 h-full ">
        <div class='block'>
          <div class="block mb-2" id='ddHeaderLeft'>
            <button id="dropdownButton" data-dropdown-toggle="dropdown" class="w-full justify-center text-white bg-slate-500 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-slate-800 dark:hover:bg-slate-500 dark:focus:ring-slate-800  justify-center" type="button"> <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
              </svg>
              </button>
              
              <!-- Dropdown menu -->
              <div id="dropdownMenu" class="z-10 hidden bg-white divide-y divide-slate-100 rounded-lg shadow w-44 dark:bg-slate-500">
                 
              </div>
          </div><!-- /.block -->
          <div class="block mb-2 w-full ">
            <button data-click="showAllBrokers" class="w-full justify-center text-white bg-slate-500 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-slate-800 dark:hover:bg-slate-500 dark:focus:ring-slate-800" type="button">Все портфели</button>
          </div><!-- /.block -->
          <div class="block mb-2 w-full  ">
            <button data-modal="newPosition" class="w-full justify-center text-white bg-[#629976] 400 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  dark:focus:ring-slate-800" type="button">Добавить позицию</button>
          </div><!-- /.block -->
            <div class="block mb-2 w-full ">
            <button data-click="showHistory" class="w-full justify-center text-white bg-slate-500 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-slate-800 dark:hover:bg-slate-500 dark:focus:ring-slate-800" type="button">Журнал сделок</button>
          </div><!-- /.block -->
          <!-- <div class="block mb-2  w-full ">
            <button data-modal="sellPosition" class="w-full justify-center text-white bg-[#d07676] hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-centerdark:focus:ring-slate-800" type="button">Продать</button>
          </div> -->
        </div>
        <div class="cursor-pointer group" data-click='changeTheme' >
          <svg width="30px" height="30px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">  
            <g  stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g class='fill-slate-400 group-hover:fill-slate-900 dark:fill-slate-300 dark:group-hover:fill-slate-100' id="ic_fluent_dark_theme_24_regular" fill="#212121" fill-rule="nonzero">
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
    this.$emit('header:allbrokers')
    this.dropdownPortfolio.reset()
  }

  changeBroker(event: Event) {
    const id = +(event.target as HTMLElement).dataset['params']
    this.$emit('table:changeBroker', id)
  }
}
