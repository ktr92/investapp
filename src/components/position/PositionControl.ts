import closeByClickOutside from '../../utils/clickOutside';
import {Store} from '../../store';
import {ViewComponent} from '../table/ViewComponent';
import {CreateForm} from '../form/CreateForm';
import {Emitter} from '../Emitter';

export class PositionControl extends ViewComponent {
  constructor(public itemInfo: IItemInfo, options: Store) {
    super(options)
  }

  initListeners(emitter: Emitter) {
    const $button =document.querySelector(`#button_position${this.itemInfo.positionId}`)
    const $menu = document.querySelector(`#menu_position${this.itemInfo.positionId}`)
    $button.addEventListener('click', (e) => {
      $menu.classList.remove('hidden')
    })
    document.querySelector(`[data-buypos="${this.itemInfo.positionId}"]`).addEventListener('click', async (e) => {
      const create = await CreateForm.create('#modalContent', this.options, () => {
        console.log(1)
      })

      emitter.emit('modal:renderModal', {
        title: 'Buy position',
        content: create.$el.innerHTML
      })

      create.initForm()
      $menu.classList.add('hidden')
    })

    closeByClickOutside(`#menu_position${this.itemInfo.positionId}`, `#button_position${this.itemInfo.positionId}`)
  }

  render() {
    return `
      <div class="flex relative">
        <button id="button_position${this.itemInfo.positionId}" data-dropdown-toggle="dropdown" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-20 justify-center" type="button"> 
          <svg class="w-2.5 h-2.5 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
          </svg>
      </button>
      
      <div id="menu_position${this.itemInfo.positionId}" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute top-full right-0">
        <div class='class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"' data-buypos="${this.itemInfo.positionId}" >Buy</div>
        <div class='class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"' data-salepos="${this.itemInfo.positionId}">Sale</div>
        <div class='class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"' data-editpos="${this.itemInfo.positionId}">Edit</div>
        <div class='class="cursor-pointer block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"' data-deletepos="${this.itemInfo.positionId}">Delete</div>
      </div>
    </div>
    `
  }
}
