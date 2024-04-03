import closeByClickOutside from '../../utils/clickOutside'
import {Store} from '../../store'
import Dropdown from '../UI/Dropdown'
import numberWithSpaces from '../../utils/formatNumber'
import {moexBonds} from '../../utils/getStockPrice'

export class CreateForm {
  constructor(selector: string, public state: Store, public onSubmit?: (id: number, position: IPosition, isclone: boolean,) => void) {
    this.$el = document.querySelector(selector)
    this.isvalid = false
  /*   this.initForm() */
  }

  public $el: HTMLElement
  public dropdownBroker: Dropdown
  public foundList: Array<Array<string>>
  public isvalid: boolean
  public currentTicker: string
  public category: string

  initBrokers() {
    const all = this.state.getters.getAllPortfolio();
    const brokerLIst: Array<IListItem> = []

    all.forEach(broker => {
      brokerLIst.push({
        id: String(broker.id),
        text: broker.name,
        type: 'event'
      })
    })

    let selectBroker = ''
    brokerLIst.forEach(broker => {
      selectBroker += `<option value="${broker.id}">${broker.text}</option>`
    })

    return selectBroker
  }

  async searchItem(key: string) {
    let res: Array<Array<string>> = []
    if (this.category === 'stocks') {
      res = this.state.getters.getMoexByName(key)
    }

    if (this.category === 'bonds') {
      res = this.state.getters.getMoexByName(key)
    }

    return res
  }

  calc(ticker: string, isload: boolean) {
    let price = 0;
    let stop = 0;
    let count = 0
    const $price = document.querySelector('input[name="price"]') as HTMLInputElement
    const $stop = document.querySelector('input[name="stop"]') as HTMLInputElement
    const $count = document.querySelector('input[name="count"]') as HTMLInputElement
    const $result = document.querySelector('[data-result="total"]') as HTMLDivElement

    if (isload) {
      price = Number(this.state.getters.getMoexPrice(ticker)[12]);
      stop = Number(price) * 0.98;
      count = Math.round(50000/Number(price))
    } else {
      price = Number($price.value)
      stop = Number($stop.value)
      count = Number($count.value)
    }

    $price.value = String(price);
    $count.value = String(count);
    $stop.value = String(stop.toFixed(2));

    $result.textContent = numberWithSpaces(String((Number(price) * count).toFixed(2)));
  }

  initForm() {
    const $form = document.createElement('form')
    $form.setAttribute('id', 'createForm')
    this.$el.insertAdjacentElement('beforeend', $form)

    $form.insertAdjacentHTML('afterbegin', this.init(this.initBrokers()))
    this.category = 'stock'

    const $ticker = this.$el.querySelector('[name="name"]') as HTMLInputElement

    $ticker.focus()

    this.$el.querySelectorAll('input[data-calc="totalprice"]').forEach(item => {
      item.addEventListener('input', (e) => {
        this.calc(this.currentTicker, false)
      })
    })
    this.$el.querySelector('[name="category"]').addEventListener('change', (e) => {
      this.category = (e.target as HTMLSelectElement).value
    })

    $ticker.addEventListener('input', async (e) => {
      const $input = e.target
      const val = (e.target as HTMLInputElement).value
      const dropdown: HTMLElement = this.$el.querySelector('[data-dropdown="name"]')
      dropdown.innerHTML = ''

      if (val.length > 1) {
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

          dropdown.addEventListener('click', (e) => {
            if (e.target instanceof HTMLElement) {
              if (e.target.dataset.ticker) {
                ($input as HTMLInputElement).value = e.target.dataset.ticker
                this.isvalid = true
                dropdown.classList.add('hidden')
                this.currentTicker = e.target.dataset.ticker
                this.calc(this.currentTicker, true)
              }
            }
          })
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

    this.$el.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault()
      const formdata = new FormData(this.$el.querySelector('form'))

      let result = null
      if (this.category === 'stocks') {
        result = {
          ticker: String(formdata.get('name')),
          type: 'stock',
          market: 'TQCB',
          buyPrice: Number(formdata.get('price')),
          count: Number(formdata.get('count')),
          myStop: Number(formdata.get('stop')),
        }
      }
      if (this.category === 'bonds') {
        result = {
          ticker: String(formdata.get('name')),
          type: 'bonds',
          market: 'TQOB',
          buyPrice: Number(formdata.get('price')),
          count: Number(formdata.get('count')),
        }
      }
      if (this.category === 'cash') {
        result = {
          ticker: 'cash',
          type: 'cash',
          market: '',
          buyPrice: Number(formdata.get('price')),
          count: 1,
        }
      }

      if (this.isvalid) {
        this.onSubmit(
            Number(formdata.get('portfolio')),
            result,
            Boolean(formdata.get('isclone'))
        )
      }
    })
  }
  init(selectBroker: string) {
    return `
    
                    <div class="sm:col-span-2 mb-4">
                        <label for="portfolio" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select portfolio</label>
                        <select id="portfolio" name="portfolio" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          ${selectBroker}
                        </select>
                    </div>
                    <div class="sm:col-span-2 mb-4">
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                        <select id="category" name="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          <option value="stocks">Stocks</option>
                          <option value="bonds">Bonds</option>
                          <option value="cash">Cash</option>
                        </select>
                    </div>
                  <div class="sm:col-span-2  mb-4 relative">
                      <label for="name"class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input autocomplete="off" value="" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ticker, name" >

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
                  <div class="w-full  mb-4">
                      <label for="count"class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Count</label>
                      <input data-calc="totalprice" value="50"  type="text" name="count" id="count" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Count" >
                  </div>
                  <div class="w-full  mb-4">
                      <label for="stop" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stop-Loss</label>
                      <input type="text" name="stop" id="stop" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Stop" >
                  </div>
                  
                  <div class="sm:col-span-2 mb-4">
                      <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                      <textarea id="description" rows="4" class="block p-1 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Notes"></textarea>
                  </div>
              </div>
              <div class="flex">
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Confirm
                </button>
                <div class="pl-4" data-result="total">0 </div>&nbsp;₽
              </div>
              
     
    `
  }
}
