import closeByClickOutside from '../../utils/clickOutside'
import {Store} from '../../store'
import Dropdown from '../UI/Dropdown'
import numberWithSpaces from '../../utils/formatNumber'
import {getBrokerList} from '../AppUtils'
import {initFormData} from '../../utils/getStockPrice'
import {mapMarket} from '../../utils/maps'

export class CreateForm {
  constructor(selector: string, public state: Store, public onSubmit?: (id: string, position: IPosition, isclone: boolean, market: string) => void) {
    this.$el = document.querySelector(selector)
    this.isvalid = false
    this.category = this.state.getters.getCategory(this.state.defaultPortfolio)
  }

  public $el: HTMLElement
  public dropdownBroker: Dropdown
  public foundList: Array<Array<string>>
  public isvalid: boolean
  public currentTicker: string
  public category: string
  public mDataList: IMarketsList
  public isLoading: boolean
  public currentItem: IItem

  static async create(selector: string, state: Store, onSubmit?: (id: string, position: IPosition, isclone: boolean,) => void) {
    const instance = new CreateForm(selector, state, onSubmit)
    await instance.initMarketData()
    return instance
  }

  async initMarketData() {
    await this.state.actions.initSearch(this.category)
  }

  initForm() {
    const $form = document.createElement('form')
    $form.setAttribute('id', 'createForm')
    this.$el.insertAdjacentElement('beforeend', $form)

    $form.insertAdjacentHTML('afterbegin', this.init(this.initBrokers()))
    /*     this.category = (document.querySelector('#portfolio') as HTMLSelectElement).value
 */
    const $ticker = this.$el.querySelector('[name="name"]') as HTMLInputElement

    $ticker.focus()
    this.initFormListeners()
    this.initTickerInput($ticker)
    this.initFormSubmit()
  }

  async searchItem(key: string) {
    let res: Array<Array<string>> = []
    res = this.state.getters.getMoexByName(key)
    return res
  }

  changeForm(loading: boolean) {
    const $loader = document.querySelector('.loader')
    if (loading) {
      $loader.classList.remove('hidden')
    } else {
      $loader.classList.add('hidden')
    }
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

  changeFields() {
    const $ticker: HTMLInputElement = document.querySelector('[name="name"]')
    $ticker.value = ''
    this.calc('', false)
    /*     if (this.category === 'TQCB' || this.category === 'TQOB') {
 */ if (mapMarket()[this.category].type === 'bonds') {
      document.querySelector('[data-input="stopValue"]').classList.add('hidden')
    } else {
      document.querySelector('[data-input="stopValue"]').classList.remove('hidden')
    }
    $ticker.focus()
  }

  calcCurrency() {
    const $currency: HTMLElement = document.querySelector('[data-input="currencyValue"]')
    const $currencyInput: HTMLInputElement = $currency.querySelector('input')

    const isCurrency = this.currentItem.currency
    if (isCurrency && isCurrency !== 'SUR') {
      $currency.classList.remove('hidden')
      $currencyInput.value = String(this.state.getters.getCurrency(isCurrency))
    } else {
      $currency.classList.add('hidden')
      $currencyInput.value = '1'
    }
  }

  calc(ticker: string, isload: boolean) {
    let price = 0;
    let stop = 0;
    let count = 0
    const $price = document.querySelector('input[name="price"]') as HTMLInputElement
    const $stop = document.querySelector('input[name="stop"]') as HTMLInputElement
    const $count = document.querySelector('input[name="count"]') as HTMLInputElement
    const $result = document.querySelector('[data-result="total"]') as HTMLDivElement
    const broker = (document.querySelector('#portfolio') as HTMLSelectElement).value

    if (ticker === '') {
      $price.value = ''
      $stop.value = ''
      $count.value = ''
      $result.textContent = '0'

      return
    }

    if (isload) {
      price = this.currentItem.price
      stop = Number(price) * 0.98;
      if (price) {
        if (this.currentItem.currency === 'SUR') {
          count = Math.round(this.state.getters.getPortfolioSumm(broker)/Number(price))
        } else {
          count = 1
        }
      } else {
        count = 1
      }
    } else {
      price = Number($price.value)
      stop = Number($stop.value)
      count = Number($count.value)
    }

    $price.value = String(price);
    $count.value = String(count);
    $stop.value = String(stop.toFixed(2));

    const nominal = this.currentItem.nominal
    const currency = this.state.getters.getCurrency(this.currentItem.currency)
    $result.textContent = numberWithSpaces(String((Number(price) * Number(nominal) / 100 * Number(currency) * count).toFixed(2)));
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

        this.currentItem = this.state.getters.getData_moex(this.currentTicker, this.category, ['name', 'fullname', 'engname', 'price', 'startPrice', 'currency', 'nominal'])

        this.calc(this.currentTicker, true)
        this.calcCurrency()
        this.showInfo()
        /* $block.removeEventListener('click', (e) => this.onSelect(e, $input)) */
        $block.classList.add('hidden')
        console.log('currentItem: ', this.currentItem)
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

      result = initFormData(this.category, formdata, this.state.moexSearch.moexSecurities)

      if (this.isvalid) {
        this.onSubmit(
            String(formdata.get('portfolio')),
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

  init(selectBroker: string) {
    return `
          <div id="modalLoader" class="hidden loader absolute w-full h-full flex items-center justify-center left-0 right-0 top-0 bottom-0 z-40 bg-[rgba(233,233,233,0.2)]">
            <div role="status">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
          </div>
                    <div class="sm:col-span-2 mb-4">
                        <label for="portfolio" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select portfolio</label>
                        <select id="portfolio" name="portfolio" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          ${selectBroker}
                        </select>
                    </div>
                    <div class="sm:col-span-2 mb-4">
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                        <select id="category" name="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option value="TQBR">Stocks</option>
                          <option value="TQCB">Corporative Bonds</option>
                          <option value="TQOB">Bonds</option>
                          <option value="cash">Cash</option>
                        </select>
                    </div>
                  <div class="sm:col-span-2  mb-4 relative">
                     <div class="">
                      <div id="tickerName"></div>
                      <div id="bonds_dohod"></div>
                      <div id="bonds_nkd"></div>
                      <div id="bonds_finish"></div>
                      <div id="bonds_currency"></div>
                      <div id="bonds_coupon"></div>
                      <div id="bonds_nextcoupon"></div>
                    </div>
                      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ticker / name</label>
                      <input autocomplete="off" value="" type="text" name="name" id="name" class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ticker, name" >

                      <div  class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute hidden" data-dropdown='name'>
                          
                        
                      </div>
                  </div>
                  <div class="flex items-center mb-4" data-input="clone">
                    <input id="isclone" name="isclone" type="checkbox" value="isclone"
                        class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-500 dark:border-gray-600 " />

                    <label for="isclone" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer">
                        Clone ?
                    </label>
                </div>
                  <div class="w-full  mb-4">
                      <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                      <input data-calc="totalprice" value="" type="text" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Price" >
                  </div>
                  <div class="w-full  mb-4" data-input="count">
                      <label for="count" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Count</label>
                      <input data-calc="totalprice" value="50"  type="text" name="count" id="count" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Count" >
                  </div>
                  <div class="w-full  mb-4" data-input="stopValue">
                      <label for="stop" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stop-Loss</label>
                      <input type="text" name="stop" id="stop" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Stop" >
                  </div>
                  <div class="w-full  mb-4 hidden" data-input="currencyValue">
                  <label for="currencyValue" class=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">Currency</label>
                    <input type="text" name="currencyValue" id="currencyValue" value="1" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Currency value at buy moment" >
                </div>
                  
                  <div class="sm:col-span-2 mb-4" >
                      <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                      <textarea id="description" rows="4" class="block p-1 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Notes"></textarea>
                  </div>
              </div>
              <div class="flex items-center">
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Confirm
                </button>
                <div class="pl-4" data-result="total">0 </div>&nbsp;₽
              </div>
              
     
    `
  }
}
