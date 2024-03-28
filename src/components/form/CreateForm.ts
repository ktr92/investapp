import {Store} from '../../store'
import Dropdown from '../UI/Dropdown'

export class CreateForm {
  constructor(selector: string, public state: Store, public callback?: CallbackFunction) {
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
    $form.insertAdjacentHTML('afterbegin', this.init(this.initBrokers()))
    this.$el.insertAdjacentElement('beforeend', $form)
    this.$el.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault()
      console.log(new FormData($form))
    })
  }
  init(selectBroker: string) {
    return `
    
              <div class="">
                    <div class="sm:col-span-2 mb-4">
                        <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select id="category" name="broker" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                          ${selectBroker}
                        </select>
                    </div>
                  
                  </div>
                  <div class="sm:col-span-2  mb-4">
                      <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                      <input type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" >
                  </div>
                  <div class="w-full  mb-4">
                      <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
                      <input type="text" name="brand" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Product brand" >
                  </div>
                  <div class="w-full  mb-4">
                      <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
                      <input type="number" name="price" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" >
                  </div>
                 
                  <div class=" mb-4">
                      <label for="item-weight" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (kg)</label>
                      <input type="number" name="item-weight" id="item-weight" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="12" >
                  </div> 
                  <div class="sm:col-span-2 mb-4">
                      <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                      <textarea id="description" rows="8" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here"></textarea>
                  </div>
              </div>
              <button type="submit" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                  Add product
              </button>
     
    `
  }
}
