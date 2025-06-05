import closeByClickOutside from '../../utils/clickOutside'
import {Store} from '../../store/moex'
import Dropdown from '../UI/Dropdown'
import numberWithSpaces from '../../utils/formatNumber'
import {getBrokerList} from '../../utils/appUtils'
import {initFormData} from '../../utils/getStockPrice'
import {mapMarket} from '../../utils/maps'
import {Form} from './Form'
import * as template from './form.tempalte'

interface IModalData {
  id: string,
  ptf: string,
  market: string
}

export class CreateForm extends Form {
  constructor(selector: string, public state: Store, public onSubmit?: (id: string, position: IPosition, isclone?: boolean, market?: string) => void) {
    super(selector, state, onSubmit)
  }

  static async create(selector: string, state: Store, onSubmit?: (id: string, position: IPosition, isclone?: boolean,) => void, modaldata?: IModalData, ) {
    const instance = new CreateForm(selector, state, onSubmit)
    await instance.initMarketData()
    return instance
  }

  async initMarketData() {
    await this.state.actions.initSearch(this.category)
  }

  postInit() {
    const $ticker = this.$el.querySelector('[name="name"]') as HTMLInputElement

    $ticker.focus()

    this.initFormListeners()
    this.initTickerInput($ticker)
  }

  async searchItem(key: string) {
    let res: Array<Array<string>> = []
    res = this.state.getters.getMoexByName(key)
    return res
  }

  showInfo() {
    if (this.currentTicker) {
      document.querySelector('label[for="name"]').textContent = this.currentTicker
      const name = this.currentItem.name
      if (name.length) {
        document.querySelector('label[for="name"]').textContent = name
      }
    }
  }

  initFormListeners() {
    this.$el.querySelectorAll('input[data-calc="totalprice"]').forEach(item => {
      item.addEventListener('input', (e) => {
        if (this.currentTicker) {
          this.calc(this.currentTicker, false)
        }
      })
    })
    this.$el.querySelector('[name="category"]').addEventListener('change', async (e) => {
      this.category = (e.target as HTMLSelectElement).value
      this.changeForm(true)
      await this.initMarketData()
      this.changeFields()
      this.changeForm(false)
    })
  }

  onSelect(e: Event, $input: EventTarget, $block?: HTMLElement, listener?: CallbackFunction) {
    if (e.target instanceof HTMLElement) {
      if (e.target.dataset.ticker) {
        ($input as HTMLInputElement).value = e.target.dataset.ticker
        this.isvalid = true
        this.currentTicker = e.target.dataset.ticker

        this.currentItem = this.state.getters.getData_moex(this.currentTicker, this.category, ['name', 'fullname', 'engname', 'price', 'startPrice', 'currency', 'nominal', 'nkd'])

        this.calc(this.currentTicker, true)
        this.calcCurrency()
        this.showInfo()
        /* $block.removeEventListener('click', (e) => this.onSelect(e, $input)) */
        $block.classList.add('hidden')
        $block.removeEventListener('click', listener)
      }
    }
  }

  initTickerInput($ticker: HTMLInputElement) {
    $ticker.addEventListener('input', async (e) => {
      const $input = e.target
      const val = (e.target as HTMLInputElement).value
      const dropdown: HTMLElement = this.$el.querySelector('[data-dropdown="name"]')
      dropdown.innerHTML = ''

      if (val.length > 2 && this.state.getters.getMoexSearch()) {
        this.foundList = await this.searchItem(val)
        dropdown.classList.remove('hidden')
        closeByClickOutside('[data-dropdown="name"]', '[name="name"]')

        let content = ''

        if (this.foundList.length) {
          ($input as HTMLInputElement).classList.remove('!border-red-500')
          this.foundList.forEach(item => {
            content += `
              <span data-name="${item[2]}" data-ticker="${item[0]}" class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">${item[2]}</span>
            `
          });

          const listhtml = document.createElement('div')
          listhtml.innerHTML = content
          dropdown.appendChild(listhtml)

          const listener = (e: Event) => {
            this.onSelect(e, $input, dropdown, listener)
          }

          dropdown.addEventListener('click', listener)
        } else {
          ($input as HTMLInputElement).classList.add('!border-red-500')
          this.isvalid = false
        }
      } else {
        this.isvalid = false
        this.foundList = []
        dropdown.classList.add('hidden')
      }
    })
  }

  initFormSubmit() {
    this.$el.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault()
      const formdata = new FormData(this.$el.querySelector('form'))

      let result = null

      if (this.isvalid) {
        result = initFormData(
            this.category,
            formdata,
            this.state.moexSearch.moexSecurities,
            this.currentPortfolio ? this.currentPortfolio : this.modaldata.ptf,
            this.modaldata ? this.modaldata.id : null)

        this.onSubmit(
          this.currentPortfolio ? this.currentPortfolio : this.modaldata.ptf,
          result,
          Boolean(formdata.get('isclone')),
          this.category
        )
      }
    });
  }
  initBrokers() {
    const brokerLIst = getBrokerList(this.state)

    let selectBroker = ''
    brokerLIst.forEach((broker, index) => {
      let attr = ''
      if (index === 0) {
        attr += 'selected="selected"'
      }
      selectBroker += `<option value="${broker.id}" ${attr}>${broker.text}</option>`
    })
    return selectBroker
  }

  async renderMode() {
    let form = ''
    let currentPosition: IPosition = null
    if (this.modaldata) {
      currentPosition= this.state.getters.getPositionById(this.modaldata.id)
      this.category = this.modaldata.market ? this.modaldata.market: this.category
      await this.initMarketData()
    }

    form += template.renderBroker(this.initBrokers())
          + template.renderCategory()
          + template.renderSearch()
          + template.renderClone()
          + this.renderPrice()
          + this.renderCount()
          + this.renderNkd()
          + this.renderCurrency()
          + this.renderStop()

    form += this.renderSubmit()

    return form
  }

  renderSubmit() {
    return `
      <div class="flex items-center">
        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Confirm
        </button>
        <div class="pl-4" data-result="total">0 </div>&nbsp;₽
      </div>
    `
  }
}
