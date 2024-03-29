import {Store} from '../../store'
import Dropdown from '../UI/Dropdown'

export class CreateForm {
  constructor(selector: string, public state: Store, public onSubmit?: (id: number, position: IPosition) => void) {
    this.$el = document.querySelector(selector)
  /*   this.initForm() */
  }

  public $el: HTMLElement
  public dropdownBroker: Dropdown

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

  initForm() {
    const $form = document.createElement('form')
    $form.setAttribute('id', 'createForm')
    this.$el.insertAdjacentElement('beforeend', $form)

    $form.insertAdjacentHTML('afterbegin', this.init(this.initBrokers()))

    this.$el.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      const formdata = new FormData(this.$el.querySelector('form'))

      // validtaion
      this.onSubmit(
          Number(formdata.get('portfolio')), {
            ticker: String(formdata.get('name')),
            buyPrice: Number(formdata.get('price')),
            count: Number(formdata.get('count')),
            myStop: Number(formdata.get('stop')),
          })
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
                          <option value="Stocks">Stocks</option>
                          <option value="Bonds">Bonds</option>
                          <option value="Cash">Cash</option>
                        </select>
                    </div>
                  <div class="sm:col-span-2  mb-4">
                      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                      <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Ticker" >
                  </div>
                  <div class="w-full  mb-4">
                      <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                      <input type="text" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Price" >
                  </div>
                  <div class="w-full  mb-4">
                      <label for="count" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Count</label>
                      <input type="text" name="count" id="count" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Count" >
                  </div>
                  <div class="w-full  mb-4">
                      <label for="stop" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stop-Loss</label>
                      <input type="text" name="stop" id="stop" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Stop" >
                  </div>
                  
                  <div class="sm:col-span-2 mb-4">
                      <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                      <textarea id="description" rows="8" class="block p-1 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Notes"></textarea>
                  </div>
              </div>
              <button type="submit" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                  Add product
              </button>
     
    `
  }
}
